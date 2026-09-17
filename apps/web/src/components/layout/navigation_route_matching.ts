import type { NavigationItem } from "./navigation_items";

export const matches_route = (pathname: string, href: string): boolean =>
  pathname === href || pathname.startsWith(`${href}/`);

export const has_active_child = (pathname: string, item: NavigationItem): boolean =>
  (item.children ?? []).some((child) => matches_route(pathname, child.href));

export const is_item_active = (pathname: string, item: NavigationItem): boolean =>
  item.children ? pathname === item.href : matches_route(pathname, item.href);
