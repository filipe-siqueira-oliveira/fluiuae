"use client";

import { SidebarCollapseToggle } from "./sidebar_collapse_toggle";
import { SidebarContainer } from "./sidebar_layout_styles";
import { SidebarPanel } from "./sidebar_panel";
import { use_sidebar_collapse } from "./use_sidebar_collapse";
import type { WorkspaceNavigation } from "./workspace_navigation";
import type { AuthenticatedUser } from "@/types/session";

type AppSidebarProps = {
  user: AuthenticatedUser;
  workspace_navigation: WorkspaceNavigation;
};

export const AppSidebar = ({ user, workspace_navigation }: AppSidebarProps) => {
  const { is_collapsed, is_locked, toggle_collapse } = use_sidebar_collapse();

  return (
    <SidebarContainer $is_collapsed={is_collapsed}>
      <SidebarPanel user={user} workspace_navigation={workspace_navigation} is_collapsed={is_collapsed} />
      {is_locked ? null : <SidebarCollapseToggle is_collapsed={is_collapsed} on_toggle={toggle_collapse} />}
    </SidebarContainer>
  );
};
