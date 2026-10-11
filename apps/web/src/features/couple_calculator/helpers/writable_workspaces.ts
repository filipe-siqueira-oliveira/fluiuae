import { MemberRole } from "@fluiuae/database/enums";
import type { WorkspaceSummaryDto } from "@/types/api";

const writable_roles: MemberRole[] = [MemberRole.OWNER, MemberRole.ADMIN];

export const list_writable_workspaces = (workspaces: WorkspaceSummaryDto[]): WorkspaceSummaryDto[] =>
  workspaces.filter((workspace) => writable_roles.includes(workspace.role));

export const pick_default_share_workspaces = (writable_workspaces: WorkspaceSummaryDto[]) => {
  const own_workspace =
    writable_workspaces.find((workspace) => workspace.role === MemberRole.OWNER) ?? writable_workspaces[0];
  const partner_workspace = writable_workspaces.find((workspace) => workspace.id !== own_workspace?.id);

  return {
    first_workspace_id: own_workspace?.id,
    second_workspace_id: partner_workspace?.id,
  };
};
