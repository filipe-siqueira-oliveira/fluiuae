import { http_client } from "@/lib/http_client";

export const activate_workspace_request = async (workspace_id: string): Promise<void> => {
  await http_client.post(`/workspaces/${workspace_id}/activate`);
};
