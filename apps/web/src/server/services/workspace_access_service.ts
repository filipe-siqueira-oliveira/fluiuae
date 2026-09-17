import { prisma_client } from "@fluiuae/database";
import { forbidden } from "@/lib/http_error";
import type { SessionPayload } from "@/types/session";
import type { WorkspaceSummaryDto } from "@/types/api";

export const list_user_workspaces = async (
  user_id: string
): Promise<WorkspaceSummaryDto[]> => {
  const memberships = await prisma_client.workspaceMember.findMany({
    where: { user_id },
    include: { workspace: { select: { id: true, name: true, owner: { select: { name: true } } } } },
    orderBy: { created_at: "asc" },
  });

  return memberships.map((membership) => ({
    id: membership.workspace.id,
    name: membership.workspace.name,
    owner_name: membership.workspace.owner.name,
    role: membership.role,
  }));
};

export const activate_workspace = async (
  user_id: string,
  workspace_id: string
): Promise<SessionPayload> => {
  const membership = await prisma_client.workspaceMember.findUnique({
    where: { workspace_id_user_id: { workspace_id, user_id } },
  });

  if (!membership) {
    throw forbidden("user_not_member_of_workspace");
  }

  return { user_id, workspace_id, role: membership.role };
};
