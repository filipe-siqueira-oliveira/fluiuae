import dayjs, { type Dayjs } from "dayjs";
import { TransactionType } from "@fluiuae/database/enums";
import {
  decode_payment_source,
  payment_source_from_reference,
} from "@/features/payment_sources/helpers/payment_source_value";
import type { TransactionPayload } from "../api/transactions_api";
import type { TransactionDto } from "@/types/api";

export type TransactionFormValues = {
  type: TransactionType;
  description: string;
  amount: number;
  issued_at: Dayjs;
  notes?: string | null;
  payment_source?: string;
  destination_account_id?: string | null;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export const build_initial_form_values = (
  transaction: TransactionDto | null,
  default_payment_source: string | undefined,
  default_category_id: string | null
): TransactionFormValues => ({
  type: transaction?.type ?? TransactionType.EXPENSE,
  description: transaction?.description ?? "",
  amount: Number(transaction?.amount ?? 0),
  issued_at: transaction ? dayjs(transaction.issued_at) : dayjs(),
  notes: transaction?.notes ?? "",
  payment_source: transaction ? payment_source_from_reference(transaction) : default_payment_source,
  destination_account_id: transaction?.destination_account?.id ?? null,
  category_id: transaction ? transaction.category?.id ?? null : default_category_id,
  is_automatic_debit: transaction ? transaction.is_automatic_debit : true,
});

export const to_transaction_payload = (values: TransactionFormValues): TransactionPayload => ({
  type: values.type,
  description: values.description,
  amount: values.amount,
  issued_at: values.issued_at.toISOString(),
  notes: values.notes || null,
  ...decode_payment_source(values.payment_source),
  destination_account_id:
    values.type === TransactionType.TRANSFER ? values.destination_account_id ?? null : null,
  category_id: values.type === TransactionType.TRANSFER ? null : values.category_id ?? null,
  is_automatic_debit: values.type === TransactionType.EXPENSE && Boolean(values.is_automatic_debit),
});
