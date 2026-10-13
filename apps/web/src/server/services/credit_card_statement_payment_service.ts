import { CategoryKind, TransactionStatus, TransactionType, prisma_client, type Prisma } from "@fluiuae/database";
import { bad_request, conflict, not_found } from "@/lib/http_error";
import { is_paid_before_closing, resolve_statement_phase } from "@/lib/credit_card_statement";
import { parse_month_string } from "@/lib/month_calendar";
import { summarize_statement_balance, to_cents } from "./credit_card_statement_balance";
import {
  describe_statement_dates,
  find_credit_card_or_fail,
  load_statement_ledger,
  resolve_card_open_month,
} from "./credit_card_statement_builder";
import type { PayCreditCardStatementInput } from "@/validation/credit_card_statement_payment_schemas";

const statement_payment_category_name = "Cartão de crédito";

const due_month_formatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const describe_payment = (credit_card_name: string, due_date: Date, is_advance: boolean): string =>
  `${is_advance ? "Pagamento antecipado" : "Pagamento"} da fatura de ${due_month_formatter.format(due_date)} (${credit_card_name})`;

type SettlementPurchase = { id: string; amount: unknown };

type SettlementPayment = { transaction: { amount: unknown; paid_at: Date | null; issued_at: Date } };

type RemovedStatementPayment = {
  workspace_id: string;
  credit_card_id: string;
  statement_month: Date;
  transaction_id: string;
};

const resolve_last_paid_at = (payments: SettlementPayment[]): Date =>
  new Date(
    Math.max(...payments.map((payment) => (payment.transaction.paid_at ?? payment.transaction.issued_at).getTime()))
  );

export type StatementSettlement = {
  purchase_ids: string[];
  data: Prisma.TransactionUpdateManyMutationInput;
};

const resolve_statement_settlement = (
  purchases: SettlementPurchase[],
  payments: SettlementPayment[]
): StatementSettlement => ({
  purchase_ids: purchases.map((purchase) => purchase.id),
  data: summarize_statement_balance(purchases, payments).is_settled
    ? { status: TransactionStatus.PAID, paid_at: resolve_last_paid_at(payments) }
    : { status: TransactionStatus.PENDING, paid_at: null },
});

export const apply_statement_settlement = (settlement: StatementSettlement) =>
  prisma_client.transaction.updateMany({ where: { id: { in: settlement.purchase_ids } }, data: settlement.data });

export const plan_settlement_after_payment_removal = async (
  removed_payment: RemovedStatementPayment
): Promise<StatementSettlement> => {
  const credit_card = await find_credit_card_or_fail(removed_payment.workspace_id, removed_payment.credit_card_id);
  const { purchases, payments } = await load_statement_ledger(credit_card, removed_payment.statement_month);
  const remaining_payments = payments.filter((payment) => payment.transaction_id !== removed_payment.transaction_id);

  return resolve_statement_settlement(purchases, remaining_payments);
};

export const pay_credit_card_statement = async (
  workspace_id: string,
  created_by_id: string,
  credit_card_id: string,
  statement_key: string,
  input: PayCreditCardStatementInput
): Promise<void> => {
  const credit_card = await find_credit_card_or_fail(workspace_id, credit_card_id);
  const statement_month = parse_month_string(statement_key);

  if (resolve_statement_phase(statement_month, resolve_card_open_month(credit_card)) === "UPCOMING") {
    throw bad_request("statement_not_open_yet");
  }

  const [{ purchases, payments }, account, payment_category] = await Promise.all([
    load_statement_ledger(credit_card, statement_month),
    prisma_client.account.findFirst({ where: { id: input.account_id, workspace_id, is_archived: false } }),
    prisma_client.category.findFirst({
      where: { workspace_id, is_system: true, kind: CategoryKind.EXPENSE, name: statement_payment_category_name },
    }),
  ]);
  const balance = summarize_statement_balance(purchases, payments);

  if (balance.total_cents <= 0) {
    throw bad_request("statement_has_no_purchases");
  }

  if (balance.remaining_cents <= 0) {
    throw conflict("statement_already_paid");
  }

  if (to_cents(input.amount) > balance.remaining_cents) {
    throw bad_request("payment_exceeds_statement");
  }

  if (!account) {
    throw bad_request("account_not_in_workspace");
  }

  const paid_at = new Date(input.paid_at);
  const amount = input.amount.toFixed(2);
  const { due_date } = describe_statement_dates(credit_card, statement_month);
  const is_advance = is_paid_before_closing(paid_at, statement_month, credit_card.statement_closing_day);
  const settlement = resolve_statement_settlement(purchases, [
    ...payments,
    { transaction: { amount, paid_at, issued_at: paid_at } },
  ]);

  await prisma_client.$transaction([
    prisma_client.transaction.create({
      data: {
        workspace_id,
        created_by_id,
        account_id: account.id,
        category_id: payment_category?.id ?? null,
        type: TransactionType.EXPENSE,
        status: TransactionStatus.PAID,
        description: describe_payment(credit_card.name, due_date, is_advance),
        amount,
        issued_at: paid_at,
        due_date,
        paid_at,
        statement_payment: { create: { workspace_id, credit_card_id, statement_month } },
      },
    }),
    apply_statement_settlement(settlement),
  ]);
};

export const undo_credit_card_statement_payment = async (
  workspace_id: string,
  credit_card_id: string,
  statement_key: string,
  transaction_id: string
): Promise<void> => {
  await find_credit_card_or_fail(workspace_id, credit_card_id);

  const payment = await prisma_client.creditCardStatementPayment.findFirst({
    where: { workspace_id, credit_card_id, transaction_id, statement_month: parse_month_string(statement_key) },
  });

  if (!payment) {
    throw not_found("statement_payment_not_found");
  }

  const settlement = await plan_settlement_after_payment_removal(payment);

  await prisma_client.$transaction([
    prisma_client.transaction.delete({ where: { id: payment.transaction_id } }),
    apply_statement_settlement(settlement),
  ]);
};
