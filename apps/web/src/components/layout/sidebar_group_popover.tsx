"use client";

import { Popover } from "antd";
import { matches_route } from "./navigation_route_matching";
import {
  SidebarPopoverLink,
  SidebarPopoverList,
  SidebarPopoverTitle,
} from "./sidebar_group_styles";
import type { NavigationItem } from "./navigation_items";

type SidebarGroupPopoverProps = {
  item: NavigationItem;
  pathname: string;
  children: React.ReactNode;
};

export const SidebarGroupPopover = ({ item, pathname, children }: SidebarGroupPopoverProps) => (
  <Popover
    placement="rightTop"
    arrow={false}
    content={
      <SidebarPopoverList>
        <SidebarPopoverTitle href={item.href}>{item.label}</SidebarPopoverTitle>
        {(item.children ?? []).map((child) => {
          const is_active = matches_route(pathname, child.href);

          return (
            <SidebarPopoverLink
              key={child.href}
              href={child.href}
              $is_active={is_active}
              aria-current={is_active ? "page" : undefined}
            >
              {child.label}
            </SidebarPopoverLink>
          );
        })}
      </SidebarPopoverList>
    }
  >
    {children}
  </Popover>
);
