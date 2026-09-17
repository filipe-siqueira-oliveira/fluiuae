import { http_client, unwrap_response } from "@/lib/http_client";
import type { TransactionDto, TransactionSummaryDto } from "@/types/api";
import type { TransactionStatus, TransactionType } from "@fluiuae/database/enums";

export type TransactionPayload = {
  type: TransactionType;
  description: string;
  amount: number;
  issued_at: string;
  notes?: string | null;
  account_id: string | null;
  credit_card_id: string | null;
  destination_account_id?: string | null;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export type TransactionListFilters = {
  type?: TransactionType;
  status?: TransactionStatus;
  account_id?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
};

export type TransactionListResult = {
  transactions: TransactionDto[];
  summary: TransactionSummaryDto;
};

export const fetch_transactions = async (
  filters: TransactionListFilters
): Promise<TransactionListResult> => {
  const response = await http_client.get("/transactions", { params: filters });

  return unwrap_response(response.data);
};

export const create_transaction_request = async (payload: TransactionPayload): Promise<void> => {
  await http_client.post("/transactions", payload);
};

export const update_transaction_request = async (
  transaction_id: string,
  payload: TransactionPayload
): Promise<void> => {
  await http_client.patch(`/transactions/${transaction_id}`, payload);
};

export const delete_transaction_request = async (transaction_id: string): Promise<void> => {
  await http_client.delete(`/transactions/${transaction_id}`);
};

export const settle_transaction_request = async (transaction_id: string): Promise<void> => {
  await http_client.post(`/transactions/${transaction_id}/settle`);
};
