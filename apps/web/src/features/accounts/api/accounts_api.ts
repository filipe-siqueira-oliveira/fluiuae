import { http_client, unwrap_response } from "@/lib/http_client";
import type { AccountDto } from "@/types/api";
import type { AccountType } from "@fluiuae/database/enums";

export type AccountPayload = {
  name: string;
  type: AccountType;
  institution?: string | null;
  institution_ispb?: string | null;
  initial_balance: number;
  is_default: boolean;
};

export const fetch_accounts = async (): Promise<AccountDto[]> => {
  const response = await http_client.get("/accounts");

  return unwrap_response(response.data);
};

export const create_account_request = async (payload: AccountPayload): Promise<void> => {
  await http_client.post("/accounts", payload);
};

export const update_account_request = async (
  account_id: string,
  payload: AccountPayload
): Promise<void> => {
  await http_client.patch(`/accounts/${account_id}`, payload);
};

export const delete_account_request = async (account_id: string): Promise<void> => {
  await http_client.delete(`/accounts/${account_id}`);
};
