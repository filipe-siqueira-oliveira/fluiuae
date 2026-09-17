import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;

export const mobile_media = `@media (max-width: ${sidebar_metrics.mobile_breakpoint}px)`;

export const SidebarContainer = styled.aside<{ $is_collapsed: boolean }>`
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  align-self: flex-start;
  width: ${({ $is_collapsed }) =>
    `${$is_collapsed ? sidebar_metrics.collapsed_width : sidebar_metrics.expanded_width}px`};
  height: 100vh;
  padding: 0 ${sidebar_metrics.horizontal_padding}px 12px;
  border-right: 1px solid ${colors.border};
  background: ${colors.sidebar_background};
  font-family: ${theme_tokens.fonts.primary};
  transition: width 200ms ease;

  ${mobile_media} {
    display: none;
  }
`;

export const SidebarPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`;

export const SidebarLogoSlot = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: ${sidebar_metrics.brand_height}px;
  margin-bottom: 8px;
`;

export const SidebarLogoPlaceholder = styled.div<{ $is_collapsed: boolean }>`
  width: ${({ $is_collapsed }) =>
    $is_collapsed
      ? `${sidebar_metrics.item_height}px`
      : `calc(100% - ${sidebar_metrics.logo_placeholder_inset * 2}px)`};
  height: ${sidebar_metrics.item_height}px;
  border-radius: 12px;
  background: ${colors.primary};
  transition: width 200ms ease;
`;

export const SidebarScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const SidebarNavigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SidebarLabel = styled.span<{ $is_collapsed: boolean }>`
  display: ${({ $is_collapsed }) => ($is_collapsed ? "none" : "inline")};
  overflow: hidden;
  text-overflow: ellipsis;
`;
