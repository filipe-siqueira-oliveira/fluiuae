import { prisma_client } from "@fluiuae/database";
import { assert_user_can_write_workspace } from "@/server/authorization/workspace_write_access";
import type { WorkspacePaymentSourcesDto } from "@/types/api";

const payment_source_order = [{ is_default: "desc" as const }, { created_at: "asc" as const }];
const payment_source_fields = { id: true, name: true, is_default: true };

export const list_workspace_payment_sources = async (
  user_id: string,
  workspace_id: string
): Promise<WorkspacePaymentSourcesDto> => {
  await assert_user_can_write_workspace(user_id, workspace_id);

  const [accounts, credit_cards] = await Promise.all([
    prisma_client.account.findMany({
      where: { workspace_id, is_archived: false },
      orderBy: payment_source_order,
      select: payment_source_fields,
    }),
    prisma_client.creditCard.findMany({
      where: { workspace_id },
      orderBy: payment_source_order,
      select: payment_source_fields,
    }),
  ]);

  return { accounts, credit_cards };
};
