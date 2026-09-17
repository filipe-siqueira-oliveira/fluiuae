"use client";

import { usePathname } from "next/navigation";
import { navigation_items } from "./navigation_items";
import { is_item_active } from "./navigation_route_matching";
import {
  SidebarLogoPlaceholder,
  SidebarLogoSlot,
  SidebarNavigation,
  SidebarPanel as PanelFrame,
  SidebarScrollArea,
} from "./sidebar_layout_styles";
import { SidebarNavigationGroup } from "./sidebar_navigation_group";
import { SidebarNavigationItem } from "./sidebar_navigation_item";
import { SidebarUserMenu } from "./sidebar_user_menu";
import { WorkspaceSwitcher } from "./workspace_switcher";
import type { WorkspaceNavigation } from "./workspace_navigation";
import type { AuthenticatedUser } from "@/types/session";

type SidebarPanelProps = {
  user: AuthenticatedUser;
  workspace_navigation: WorkspaceNavigation;
  is_collapsed: boolean;
  is_brand_visible?: boolean;
};

export const SidebarPanel = ({ user, workspace_navigation, is_collapsed, is_brand_visible = true }: SidebarPanelProps) => {
  const pathname = usePathname();

  return (
    <PanelFrame>
      {is_brand_visible ? (
        <SidebarLogoSlot aria-hidden="true">
          <SidebarLogoPlaceholder $is_collapsed={is_collapsed} />
        </SidebarLogoSlot>
      ) : null}
      <WorkspaceSwitcher
        workspaces={workspace_navigation.workspaces}
        active_workspace_id={workspace_navigation.active_workspace_id}
        is_collapsed={is_collapsed}
      />
      <SidebarScrollArea>
        <SidebarNavigation aria-label="Menu principal" data-tour="app_navigation">
          {navigation_items.map((item) =>
            item.children ? (
              <SidebarNavigationGroup
                key={item.href}
                item={item}
                pathname={pathname}
                is_collapsed={is_collapsed}
              />
            ) : (
              <SidebarNavigationItem
                key={item.href}
                item={item}
                is_active={is_item_active(pathname, item)}
                is_collapsed={is_collapsed}
              />
            )
          )}
        </SidebarNavigation>
      </SidebarScrollArea>
      <SidebarUserMenu user={user} is_collapsed={is_collapsed} />
    </PanelFrame>
  );
};
