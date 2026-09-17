import { http_client, unwrap_response } from "@/lib/http_client";
import type { CreditCardCommitmentsDto, CreditCardStatementDetailDto } from "@/types/api";

export type StatementPaymentPayload = {
  account_id: string;
  paid_at: string;
};

export const fetch_credit_card_statements = async (
  credit_card_id: string
): Promise<CreditCardStatementDetailDto[]> => {
  const response = await http_client.get(`/credit-cards/${credit_card_id}/statements`);

  return unwrap_response(response.data);
};

export const pay_statement_request = async (
  credit_card_id: string,
  statement_key: string,
  payload: StatementPaymentPayload
): Promise<void> => {
  await http_client.post(`/credit-cards/${credit_card_id}/statements/${statement_key}/payment`, payload);
};

export const undo_statement_payment_request = async (
  credit_card_id: string,
  statement_key: string
): Promise<void> => {
  await http_client.delete(`/credit-cards/${credit_card_id}/statements/${statement_key}/payment`);
};

export const fetch_credit_card_commitments = async (credit_card_id: string): Promise<CreditCardCommitmentsDto> => {
  const response = await http_client.get(`/credit-cards/${credit_card_id}/commitments`);

  return unwrap_response(response.data);
};
