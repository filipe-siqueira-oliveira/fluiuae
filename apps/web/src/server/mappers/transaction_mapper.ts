import { TransactionStatus } from "@fluiuae/database";
import {
  resolve_statement_due_date,
  resolve_statement_month,
  today_as_utc_day,
} from "@/lib/credit_card_statement";
import type { TransactionDto } from "@/types/api";
import { serialize_date, serialize_decimal } from "./decimal_serializer";
import type { TransactionWithRelations } from "@/server/services/transaction_query";

const describe_card_statement = (transaction: TransactionWithRelations): TransactionDto["card_statement"] => {
  if (!transaction.credit_card) {
    return null;
  }

  const { statement_closing_day, payment_due_day } = transaction.credit_card;
  const due_date = resolve_statement_due_date(
    resolve_statement_month(transaction.issued_at, statement_closing_day),
    statement_closing_day,
    payment_due_day
  );

  return {
    due_date: due_date.toISOString(),
    is_overdue:
      transaction.status === TransactionStatus.PENDING && due_date.getTime() < today_as_utc_day(new Date()).getTime(),
  };
};

export const to_transaction_dto = (transaction: TransactionWithRelations): TransactionDto => ({
  id: transaction.id,
  type: transaction.type,
  status: transaction.status,
  description: transaction.description,
  amount: serialize_decimal(transaction.amount),
  issued_at: transaction.issued_at.toISOString(),
  due_date: serialize_date(transaction.due_date),
  paid_at: serialize_date(transaction.paid_at),
  notes: transaction.notes,
  fixed_transaction_id: transaction.fixed_transaction_id,
  recurring_charge_id: transaction.recurring_charge_id,
  installment_number: transaction.installment_number,
  installment_count: transaction.recurring_charge?.installment_count ?? null,
  account: transaction.account,
  credit_card: transaction.credit_card ? { id: transaction.credit_card.id, name: transaction.credit_card.name } : null,
  card_statement: describe_card_statement(transaction),
  destination_account: transaction.destination_account
    ? { id: transaction.destination_account.id, name: transaction.destination_account.name }
    : null,
  category: transaction.category
    ? {
        id: transaction.category.id,
        name: transaction.category.name,
        kind: transaction.category.kind,
        color: transaction.category.color,
      }
    : null,
  created_by: transaction.created_by
    ? { id: transaction.created_by.id, name: transaction.created_by.name }
    : null,
  is_statement_payment: Boolean(transaction.statement_payment),
  is_automatic_debit: transaction.is_automatic_debit,
});
