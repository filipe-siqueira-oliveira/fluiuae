import type { FixedTransactionDto } from "@/types/api";
import type { FixedTransactionWithRelations } from "@/server/services/fixed_transaction_query";
import { serialize_date, serialize_decimal } from "./decimal_serializer";

export const to_fixed_transaction_dto = (
  fixed_transaction: FixedTransactionWithRelations
): FixedTransactionDto => ({
  id: fixed_transaction.id,
  type: fixed_transaction.type,
  description: fixed_transaction.description,
  amount: serialize_decimal(fixed_transaction.amount),
  day_of_month: fixed_transaction.day_of_month,
  starts_at_month: fixed_transaction.starts_at_month.toISOString(),
  last_generated_month: serialize_date(fixed_transaction.last_generated_month),
  account: fixed_transaction.account,
  credit_card: fixed_transaction.credit_card,
  category: fixed_transaction.category,
  is_automatic_debit: fixed_transaction.is_automatic_debit,
});
