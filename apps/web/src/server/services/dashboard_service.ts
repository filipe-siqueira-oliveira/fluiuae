import { TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";
import { sanitize_dashboard_widgets } from "@/lib/dashboard_widgets";
import { calculate_account_balances } from "./account_balance_calculator";
import { list_accounts } from "./account_service";
import { list_credit_card_statements } from "./credit_card_statement_service";
import { list_credit_cards } from "./credit_card_service";
import { list_recurring_charges } from "./recurring_charge_service";
import { generate_due_scheduled_transactions } from "./scheduled_transaction_generator";
import type { DashboardDto, DashboardUpcomingItem } from "@/types/api";

const upcoming_window_days = 15;
const cash_flow_months = 6;

const local_month_start = (date: Date, offset = 0): Date => new Date(date.getFullYear(), date.getMonth() + offset, 1);

const money = (value: number): string => value.toFixed(2);

const month_key = (date: Date): string => `${date.getFullYear()}-${date.getMonth()}`;

export const build_dashboard = async (workspace_id: string, user_id: string): Promise<DashboardDto> => {
  const now = new Date();
  const month_start = local_month_start(now);
  const next_month_start = local_month_start(now, 1);
  const previous_month_start = local_month_start(now, -1);
  const history_start = local_month_start(now, -(cash_flow_months - 1));
  const days_in_month = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  await generate_due_scheduled_transactions(workspace_id, new Date(next_month_start.getTime() - 1));

  const [user, history, accounts, balances, credit_cards, recurring_charges, fixed_groups, pending_account_items] =
    await Promise.all([
      prisma_client.user.findUniqueOrThrow({ where: { id: user_id }, select: { dashboard_widgets: true } }),
      prisma_client.transaction.findMany({
        where: {
          workspace_id,
          type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
          statement_payment: { is: null },
          issued_at: { gte: history_start, lt: next_month_start },
        },
        select: {
          id: true,
          type: true,
          status: true,
          amount: true,
          description: true,
          issued_at: true,
          credit_card_id: true,
          category: { select: { id: true, name: true, color: true } },
        },
      }),
      list_accounts(workspace_id),
      calculate_account_balances(workspace_id),
      list_credit_cards(workspace_id),
      list_recurring_charges(workspace_id),
      prisma_client.fixedTransaction.groupBy({ by: ["type"], where: { workspace_id }, _sum: { amount: true } }),
      prisma_client.transaction.findMany({
        where: {
          workspace_id,
          status: TransactionStatus.PENDING,
          credit_card_id: null,
          is_automatic_debit: false,
          type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
          issued_at: { lt: new Date(now.getTime() + upcoming_window_days * 86_400_000) },
        },
        orderBy: { issued_at: "asc" },
        take: 20,
        select: { id: true, type: true, description: true, amount: true, issued_at: true, account: { select: { name: true } } },
      }),
    ]);

  const in_month = (date: Date, start: Date) => date >= start && date < local_month_start(start, 1);
  const current = history.filter((item) => in_month(item.issued_at, month_start));
  const previous_expenses = history.filter(
    (item) => item.type === TransactionType.EXPENSE && in_month(item.issued_at, previous_month_start)
  );
  const current_expenses = current.filter((item) => item.type === TransactionType.EXPENSE);
  const sum = (items: { amount: unknown }[]) => items.reduce((total, item) => total + Number(item.amount), 0);
  const pair = (type: TransactionType) => {
    const items = current.filter((item) => item.type === type);

    return {
      paid: money(sum(items.filter((item) => item.status === TransactionStatus.PAID))),
      pending: money(sum(items.filter((item) => item.status === TransactionStatus.PENDING))),
    };
  };

  const category_totals = new Map<string, { key: string; name: string; color: string; amount: number }>();

  for (const item of current_expenses) {
    const key = item.category?.id ?? "none";
    const entry = category_totals.get(key) ?? {
      key,
      name: item.category?.name ?? "Sem categoria",
      color: item.category?.color ?? "#9AA8A0",
      amount: 0,
    };
    entry.amount += Number(item.amount);
    category_totals.set(key, entry);
  }

  const cumulative = (items: typeof current_expenses, last_day: number) => {
    const per_day = new Array(32).fill(0);

    for (const item of items) {
      per_day[item.issued_at.getDate()] += Number(item.amount);
    }

    let running = 0;

    return Array.from({ length: last_day }, (_, index) => (running += per_day[index + 1]));
  };
  const previous_days = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  const current_running = cumulative(current_expenses, days_in_month);
  const previous_running = cumulative(previous_expenses, previous_days);

  const cash_flow = Array.from({ length: cash_flow_months }, (_, index) => {
    const start = local_month_start(now, index - (cash_flow_months - 1));
    const items = history.filter((item) => month_key(item.issued_at) === month_key(start));

    return {
      month_start: start.toISOString(),
      income: money(sum(items.filter((item) => item.type === TransactionType.INCOME))),
      expense: money(sum(items.filter((item) => item.type === TransactionType.EXPENSE))),
    };
  });

  const statements = await Promise.all(
    credit_cards.map(async (card) => ({ card, statements: await list_credit_card_statements(workspace_id, card.id) }))
  );
  const limit_date = new Date(now.getTime() + upcoming_window_days * 86_400_000);
  const statement_items: DashboardUpcomingItem[] = statements.flatMap(({ card, statements: card_statements }) =>
    card_statements
      .filter(
        (statement) =>
          !statement.payment &&
          Number(statement.total) > 0 &&
          (statement.status === "OVERDUE" || new Date(statement.due_date) <= limit_date)
      )
      .map((statement) => ({
        key: `statement_${card.id}_${statement.statement_key}`,
        kind: "statement" as const,
        description: `Fatura ${card.name}`,
        detail: statement.phase === "OPEN" ? "Fatura aberta" : "Fatura fechada",
        amount: statement.total,
        due_date: statement.due_date,
        is_income: false,
        is_overdue: statement.status === "OVERDUE",
        href: "/cards",
      }))
  );
  const today_start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const transaction_items: DashboardUpcomingItem[] = pending_account_items.map((item) => ({
    key: `transaction_${item.id}`,
    kind: "transaction",
    description: item.description,
    detail: item.account?.name ?? "Conta",
    amount: money(Number(item.amount)),
    due_date: item.issued_at.toISOString(),
    is_income: item.type === TransactionType.INCOME,
    is_overdue: item.issued_at < today_start,
    href: "/transactions",
  }));

  const open_statement_by_card = new Map(
    statements.map(({ card, statements: card_statements }) => [
      card.id,
      card_statements.find((statement) => statement.phase === "OPEN"),
    ])
  );
  const active_charges = recurring_charges.filter(
    (charge) => charge.generated_count < charge.installment_count || new Date(charge.starts_at_month) >= month_start
  );
  const fixed_total = (type: TransactionType) =>
    Number(fixed_groups.find((group) => group.type === type)?._sum.amount ?? 0);
  const installments_month_total = active_charges
    .filter((charge) => new Date(charge.starts_at_month) <= month_start && new Date(charge.ends_at_month) >= month_start)
    .reduce((total, charge) => total + Number(charge.installment_amount), 0);
  const next_ending = [...active_charges].sort((first, second) => first.ends_at_month.localeCompare(second.ends_at_month))[0];

  return {
    month_start: month_start.toISOString(),
    days_in_month,
    today_day: now.getDate(),
    widgets: sanitize_dashboard_widgets(user.dashboard_widgets),
    summary: {
      income: pair(TransactionType.INCOME),
      expense: pair(TransactionType.EXPENSE),
      previous_expense_total: money(sum(previous_expenses)),
    },
    balance: {
      total: money([...balances.values()].reduce((total, value) => total + value, 0)),
      accounts: accounts
        .filter((account) => !account.is_archived)
        .map((account) => ({
          id: account.id,
          name: account.name,
          balance: account.current_balance,
          institution: account.institution,
          institution_ispb: account.institution_ispb,
          institution_has_logo: account.institution_has_logo,
        })),
    },
    upcoming: [...statement_items, ...transaction_items]
      .sort((first, second) => first.due_date.localeCompare(second.due_date))
      .slice(0, 8),
    categories: [...category_totals.values()]
      .sort((first, second) => second.amount - first.amount)
      .map((entry) => ({ ...entry, amount: money(entry.amount) })),
    daily_pace: Array.from({ length: Math.max(days_in_month, previous_days) }, (_, index) => ({
      day: index + 1,
      current: index < days_in_month && index < now.getDate() ? money(current_running[index]) : null,
      previous: money(previous_running[Math.min(index, previous_days - 1)]),
    })),
    cash_flow,
    credit_cards: credit_cards.map((card) => ({
      id: card.id,
      name: card.name,
      open_total: open_statement_by_card.get(card.id)?.total ?? "0.00",
      due_date: card.open_statement_due_date,
      used_amount: card.used_amount,
      credit_limit: card.credit_limit,
    })),
    top_expenses: [...current_expenses]
      .sort((first, second) => Number(second.amount) - Number(first.amount))
      .slice(0, 5)
      .map((item) => ({
        id: item.id,
        description: item.description,
        amount: money(Number(item.amount)),
        issued_at: item.issued_at.toISOString(),
        category_name: item.category?.name ?? null,
        category_color: item.category?.color ?? null,
      })),
    fixed_commitments: {
      fixed_expense_total: money(fixed_total(TransactionType.EXPENSE)),
      fixed_income_total: money(fixed_total(TransactionType.INCOME)),
      installments_month_total: money(installments_month_total),
    },
    installments: {
      active_count: active_charges.length,
      remaining_total: money(active_charges.reduce((total, charge) => total + Number(charge.remaining_amount), 0)),
      month_total: money(installments_month_total),
      next_ending: next_ending ? { description: next_ending.description, ends_at_month: next_ending.ends_at_month } : null,
    },
    payment_methods: {
      account_total: money(sum(current_expenses.filter((item) => !item.credit_card_id))),
      card_total: money(sum(current_expenses.filter((item) => item.credit_card_id))),
    },
  };
};
