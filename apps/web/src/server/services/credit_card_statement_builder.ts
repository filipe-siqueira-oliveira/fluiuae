import { TransactionType, prisma_client, type Prisma } from "@fluiuae/database";
import { not_found } from "@/lib/http_error";
import {
  resolve_open_statement_month,
  resolve_statement_closing_date,
  resolve_statement_due_date,
  resolve_statement_month,
} from "@/lib/credit_card_statement";
import { end_of_today } from "./automatic_debit_rules";
import { transaction_include } from "./transaction_query";

export const find_credit_card_or_fail = async (workspace_id: string, credit_card_id: string) => {
  const credit_card = await prisma_client.creditCard.findFirst({
    where: { id: credit_card_id, workspace_id },
  });

  if (!credit_card) {
    throw not_found("credit_card_not_found");
  }

  return credit_card;
};

export const posted_card_purchase_filter = (): Prisma.TransactionWhereInput => ({
  type: TransactionType.EXPENSE,
  OR: [{ fixed_transaction_id: null }, { issued_at: { lte: end_of_today() } }],
});

export const statement_payment_include = {
  transaction: {
    select: { id: true, amount: true, paid_at: true, issued_at: true, account: { select: { id: true, name: true } } },
  },
} satisfies Prisma.CreditCardStatementPaymentInclude;

export type StatementPaymentWithTransaction = Prisma.CreditCardStatementPaymentGetPayload<{
  include: typeof statement_payment_include;
}>;

type StatementCard = {
  id: string;
  workspace_id: string;
  statement_closing_day: number;
  payment_due_day: number;
};

const group_by_month = <Item>(items: Item[], resolve_month: (item: Item) => Date): Map<number, Item[]> => {
  const items_by_month = new Map<number, Item[]>();

  for (const item of items) {
    const month_time = resolve_month(item).getTime();
    items_by_month.set(month_time, [...(items_by_month.get(month_time) ?? []), item]);
  }

  return items_by_month;
};

export const load_card_purchases_by_statement = async (credit_card: StatementCard) => {
  const purchases = await prisma_client.transaction.findMany({
    where: {
      workspace_id: credit_card.workspace_id,
      credit_card_id: credit_card.id,
      ...posted_card_purchase_filter(),
    },
    include: transaction_include,
    orderBy: [{ issued_at: "desc" }, { created_at: "desc" }],
  });

  return group_by_month(purchases, (purchase) =>
    resolve_statement_month(purchase.issued_at, credit_card.statement_closing_day)
  );
};

export const load_card_payments_by_statement = async (
  credit_card: StatementCard
): Promise<Map<number, StatementPaymentWithTransaction[]>> => {
  const payments = await prisma_client.creditCardStatementPayment.findMany({
    where: { workspace_id: credit_card.workspace_id, credit_card_id: credit_card.id },
    include: statement_payment_include,
    orderBy: { created_at: "asc" },
  });

  return group_by_month(payments, (payment) => payment.statement_month);
};

export const load_statement_ledger = async (credit_card: StatementCard, statement_month: Date) => {
  const [purchases_by_month, payments_by_month] = await Promise.all([
    load_card_purchases_by_statement(credit_card),
    load_card_payments_by_statement(credit_card),
  ]);

  return {
    purchases: purchases_by_month.get(statement_month.getTime()) ?? [],
    payments: payments_by_month.get(statement_month.getTime()) ?? [],
  };
};

export const describe_statement_dates = (credit_card: StatementCard, statement_month: Date) => ({
  closing_date: resolve_statement_closing_date(statement_month, credit_card.statement_closing_day),
  due_date: resolve_statement_due_date(
    statement_month,
    credit_card.statement_closing_day,
    credit_card.payment_due_day
  ),
});

export const resolve_card_open_month = (credit_card: StatementCard): Date =>
  resolve_open_statement_month(credit_card.statement_closing_day);
