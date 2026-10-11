import { http_client, unwrap_response } from "@/lib/http_client";
import type { WorkspacePaymentSourcesDto } from "@/types/api";

type SharedPurchaseSharePayload = {
  workspace_id: string;
  amount: number;
  account_id: string | null;
  credit_card_id: string | null;
};

export type SharedPurchasePayload = {
  description: string;
  payer_workspace_id: string | null;
  installment_count: number;
  shares: [SharedPurchaseSharePayload, SharedPurchaseSharePayload];
};

export const create_shared_purchase_request = async (payload: SharedPurchasePayload): Promise<void> => {
  await http_client.post("/shared-purchases", payload);
};

export const list_workspace_payment_sources_request = async (
  workspace_id: string
): Promise<WorkspacePaymentSourcesDto> => {
  const response = await http_client.get(`/workspaces/${workspace_id}/payment-sources`);

  return unwrap_response(response.data);
};
