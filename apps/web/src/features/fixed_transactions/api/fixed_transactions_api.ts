import { http_client } from "@/lib/http_client";
import type { FixedTransactionType } from "../helpers/fixed_transaction_copy";

export type FixedTransactionPayload = {
  description: string;
  amount: number;
  day_of_month: number;
  account_id: string | null;
  credit_card_id: string | null;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export const create_fixed_transaction_request = async (
  type: FixedTransactionType,
  payload: FixedTransactionPayload
): Promise<void> => {
  await http_client.post("/fixed-transactions", { ...payload, type });
};

export const update_fixed_transaction_request = async (
  fixed_transaction_id: string,
  payload: FixedTransactionPayload
): Promise<void> => {
  await http_client.patch(`/fixed-transactions/${fixed_transaction_id}`, payload);
};

export const delete_fixed_transaction_request = async (
  fixed_transaction_id: string
): Promise<void> => {
  await http_client.delete(`/fixed-transactions/${fixed_transaction_id}`);
};
