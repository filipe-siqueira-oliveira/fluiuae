import { http_client } from "@/lib/http_client";

export type RecurringChargePayload = {
  description: string;
  installment_amount: number;
  installment_count: number;
  day_of_month: number;
  account_id: string | null;
  credit_card_id: string | null;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export type CreateRecurringChargePayload = RecurringChargePayload & {
  starts_at_month: string;
};

export const create_recurring_charge_request = async (
  payload: CreateRecurringChargePayload
): Promise<void> => {
  await http_client.post("/recurring-charges", payload);
};

export const update_recurring_charge_request = async (
  recurring_charge_id: string,
  payload: RecurringChargePayload
): Promise<void> => {
  await http_client.patch(`/recurring-charges/${recurring_charge_id}`, payload);
};

export const delete_recurring_charge_request = async (recurring_charge_id: string): Promise<void> => {
  await http_client.delete(`/recurring-charges/${recurring_charge_id}`);
};
