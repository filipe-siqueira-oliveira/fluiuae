"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { has_active_child, is_item_active } from "./navigation_route_matching";
import { SidebarChevronButton, SidebarGroup, SidebarGroupRow } from "./sidebar_group_styles";
import { SidebarItemLink } from "./sidebar_item_styles";
import { SidebarLabel } from "./sidebar_layout_styles";
import { sidebar_metrics } from "./sidebar_metrics";
import { SidebarFlowLinks } from "./sidebar_flow_links";
import { SidebarGroupPopover } from "./sidebar_group_popover";
import type { NavigationItem } from "./navigation_items";

type SidebarNavigationGroupProps = {
  item: NavigationItem;
  pathname: string;
  is_collapsed: boolean;
};

export const SidebarNavigationGroup = ({
  item,
  pathname,
  is_collapsed,
}: SidebarNavigationGroupProps) => {
  const Icon = item.icon;
  const is_active = is_item_active(pathname, item);
  const contains_active_child = has_active_child(pathname, item);
  const [is_open, set_is_open] = useState(is_active || contains_active_child);

  useEffect(() => {
    if (is_active || contains_active_child) {
      set_is_open(true);
    }
  }, [contains_active_child, is_active]);

  const parent_link = (
    <SidebarItemLink
      href={item.href}
      $is_active={is_active}
      $is_collapsed={is_collapsed}
      $contains_active_child={contains_active_child}
      $has_chevron
      aria-current={is_active ? "page" : undefined}
      aria-label={item.label}
    >
      <Icon size={sidebar_metrics.icon_size} strokeWidth={1.75} />
      <SidebarLabel $is_collapsed={is_collapsed}>{item.label}</SidebarLabel>
    </SidebarItemLink>
  );

  if (is_collapsed) {
    return (
      <SidebarGroupPopover item={item} pathname={pathname}>
        {parent_link}
      </SidebarGroupPopover>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupRow>
        {parent_link}
        <SidebarChevronButton
          type="button"
          $is_open={is_open}
          onClick={() => set_is_open((current_value) => !current_value)}
          aria-label={is_open ? `Fechar ${item.label}` : `Abrir ${item.label}`}
          aria-expanded={is_open}
        >
          <ChevronDown size={16} strokeWidth={2} />
        </SidebarChevronButton>
      </SidebarGroupRow>
      {is_open ? <SidebarFlowLinks items={item.children ?? []} pathname={pathname} /> : null}
    </SidebarGroup>
  );
};
