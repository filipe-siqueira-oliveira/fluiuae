import type { WorkspaceSummaryDto } from "@/types/api";

export type WorkspaceNavigation = {
  workspaces: WorkspaceSummaryDto[];
  active_workspace_id: string;
};
