"use client";

import { SidebarFlowLink, SidebarFlowList } from "./sidebar_group_styles";
import { matches_route } from "./navigation_route_matching";
import type { NavigationChildItem } from "./navigation_items";

type SidebarFlowLinksProps = {
  items: NavigationChildItem[];
  pathname: string;
};

export const SidebarFlowLinks = ({ items, pathname }: SidebarFlowLinksProps) => {
  const active_index = items.findIndex((child) => matches_route(pathname, child.href));

  return (
    <SidebarFlowList $active_index={active_index}>
      {items.map((child, index) => (
        <SidebarFlowLink
          key={child.href}
          href={child.href}
          $is_active={index === active_index}
          aria-current={index === active_index ? "page" : undefined}
        >
          {child.label}
        </SidebarFlowLink>
      ))}
    </SidebarFlowList>
  );
};
