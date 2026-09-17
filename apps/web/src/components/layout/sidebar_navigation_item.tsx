"use client";

import { Tooltip } from "antd";
import { SidebarItemLink } from "./sidebar_item_styles";
import { SidebarLabel } from "./sidebar_layout_styles";
import { sidebar_metrics } from "./sidebar_metrics";
import type { NavigationItem } from "./navigation_items";

type SidebarNavigationItemProps = {
  item: NavigationItem;
  is_active: boolean;
  is_collapsed: boolean;
};

export const SidebarNavigationItem = ({
  item,
  is_active,
  is_collapsed,
}: SidebarNavigationItemProps) => {
  const Icon = item.icon;

  return (
    <Tooltip title={is_collapsed ? item.label : null} placement="right">
      <SidebarItemLink
        href={item.href}
        $is_active={is_active}
        $is_collapsed={is_collapsed}
        aria-current={is_active ? "page" : undefined}
        aria-label={item.label}
      >
        <Icon size={sidebar_metrics.icon_size} strokeWidth={1.75} />
        <SidebarLabel $is_collapsed={is_collapsed}>{item.label}</SidebarLabel>
      </SidebarItemLink>
    </Tooltip>
  );
};
