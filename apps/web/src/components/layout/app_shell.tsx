"use client";

import { AppSidebar } from "./app_sidebar";
import { ShellContent, ShellFrame, ShellMain } from "./app_shell_styles";
import { MobileNavigation } from "./mobile_navigation";
import { ProductTour } from "./product_tour";
import type { AuthenticatedContext } from "@/types/session";
import type { WorkspaceSummaryDto } from "@/types/api";

type AppShellProps = {
  context: AuthenticatedContext;
  workspaces: WorkspaceSummaryDto[];
  children: React.ReactNode;
};

export const AppShell = ({ context, workspaces, children }: AppShellProps) => {
  const workspace_navigation = { workspaces, active_workspace_id: context.workspace.id };

  return (
    <ShellFrame>
      <AppSidebar user={context.user} workspace_navigation={workspace_navigation} />
      <ShellMain>
        <MobileNavigation user={context.user} workspace_navigation={workspace_navigation} />
        <ShellContent>{children}</ShellContent>
        <ProductTour completed_tours={context.user.completed_tours} />
      </ShellMain>
    </ShellFrame>
  );
};
