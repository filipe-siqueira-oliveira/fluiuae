import { http_client } from "@/lib/http_client";

export type CreditCardPayload = {
  name: string;
  institution: string | null;
  institution_ispb: string | null;
  credit_limit: number;
  statement_closing_day: number;
  payment_due_day: number;
  is_default: boolean;
};

export const create_credit_card_request = async (payload: CreditCardPayload): Promise<void> => {
  await http_client.post("/credit-cards", payload);
};

export const update_credit_card_request = async (
  credit_card_id: string,
  payload: CreditCardPayload
): Promise<void> => {
  await http_client.patch(`/credit-cards/${credit_card_id}`, payload);
};

export const delete_credit_card_request = async (credit_card_id: string): Promise<void> => {
  await http_client.delete(`/credit-cards/${credit_card_id}`);
};
