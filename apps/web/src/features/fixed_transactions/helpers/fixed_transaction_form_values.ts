import {
  decode_payment_source,
  payment_source_from_reference,
} from "@/features/payment_sources/helpers/payment_source_value";
import type { FixedTransactionPayload } from "../api/fixed_transactions_api";
import type { FixedTransactionDto } from "@/types/api";

export type FixedTransactionFormValues = {
  description: string;
  amount: number;
  day_of_month: number;
  payment_source?: string;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export const build_fixed_transaction_form_values = (
  fixed_transaction: FixedTransactionDto | null,
  default_payment_source: string | undefined,
  default_category_id: string | null
): FixedTransactionFormValues => ({
  description: fixed_transaction?.description ?? "",
  amount: Number(fixed_transaction?.amount ?? 0),
  day_of_month: fixed_transaction?.day_of_month ?? 1,
  payment_source: fixed_transaction
    ? payment_source_from_reference(fixed_transaction)
    : default_payment_source,
  category_id: fixed_transaction ? fixed_transaction.category?.id ?? null : default_category_id,
  is_automatic_debit: fixed_transaction?.is_automatic_debit ?? false,
});

export const to_fixed_transaction_payload = (
  values: FixedTransactionFormValues
): FixedTransactionPayload => ({
  description: values.description,
  amount: values.amount,
  day_of_month: values.day_of_month,
  ...decode_payment_source(values.payment_source),
  category_id: values.category_id ?? null,
  is_automatic_debit: Boolean(values.is_automatic_debit),
});
