import {
  is_paid_before_closing,
  resolve_statement_phase,
  resolve_statement_status,
  to_statement_key,
} from "@/lib/credit_card_statement";
import { to_transaction_dto } from "@/server/mappers/transaction_mapper";
import { from_cents, summarize_statement_balance } from "./credit_card_statement_balance";
import {
  describe_statement_dates,
  find_credit_card_or_fail,
  load_card_payments_by_statement,
  load_card_purchases_by_statement,
  resolve_card_open_month,
  type StatementPaymentWithTransaction,
} from "./credit_card_statement_builder";
import type { CreditCardStatementDetailDto, CreditCardStatementPaymentDto } from "@/types/api";

const to_statement_payment_dto = (
  payment: StatementPaymentWithTransaction,
  closing_day: number
): CreditCardStatementPaymentDto => {
  const paid_at = payment.transaction.paid_at ?? payment.transaction.issued_at;

  return {
    transaction_id: payment.transaction.id,
    amount: Number(payment.transaction.amount).toFixed(2),
    paid_at: paid_at.toISOString(),
    is_advance: is_paid_before_closing(paid_at, payment.statement_month, closing_day),
    account: payment.transaction.account,
  };
};

export const list_credit_card_statements = async (
  workspace_id: string,
  credit_card_id: string
): Promise<CreditCardStatementDetailDto[]> => {
  const credit_card = await find_credit_card_or_fail(workspace_id, credit_card_id);
  const open_month = resolve_card_open_month(credit_card);

  const [purchases_by_month, payments_by_month] = await Promise.all([
    load_card_purchases_by_statement(credit_card),
    load_card_payments_by_statement(credit_card),
  ]);

  const month_times = new Set([open_month.getTime(), ...purchases_by_month.keys(), ...payments_by_month.keys()]);

  return [...month_times]
    .sort((first_time, second_time) => second_time - first_time)
    .map((month_time) => {
      const statement_month = new Date(month_time);
      const purchases = purchases_by_month.get(month_time) ?? [];
      const payments = payments_by_month.get(month_time) ?? [];
      const { closing_date, due_date } = describe_statement_dates(credit_card, statement_month);
      const balance = summarize_statement_balance(purchases, payments);

      return {
        statement_key: to_statement_key(statement_month),
        statement_month: statement_month.toISOString(),
        closing_date: closing_date.toISOString(),
        due_date: due_date.toISOString(),
        phase: resolve_statement_phase(statement_month, open_month),
        status: resolve_statement_status({ is_paid: balance.is_settled, due_date }),
        total: from_cents(balance.total_cents),
        paid_amount: from_cents(balance.paid_cents),
        remaining_amount: from_cents(balance.remaining_cents),
        payments: payments.map((payment) => to_statement_payment_dto(payment, credit_card.statement_closing_day)),
        purchases: purchases.map(to_transaction_dto),
      };
    });
};
