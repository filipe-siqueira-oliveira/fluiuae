import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;

export const SidebarUserFooter = styled.div`
  flex-shrink: 0;
  padding-top: 10px;
  border-top: 1px solid ${colors.border};
`;

export const SidebarUserRow = styled.div<{ $is_collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $is_collapsed }) => ($is_collapsed ? "center" : "flex-start")};
  gap: 10px;
  min-height: ${sidebar_metrics.item_height + 4}px;
  padding: 0 ${({ $is_collapsed }) => ($is_collapsed ? 0 : 4)}px 0
    ${({ $is_collapsed }) => ($is_collapsed ? 0 : 8)}px;

`;

export const SidebarUserName = styled.span<{ $is_collapsed: boolean }>`
  display: ${({ $is_collapsed }) => ($is_collapsed ? "none" : "block")};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;

`;

export const SidebarAvatarButton = styled.button`
  display: inline-flex;
  flex-shrink: 0;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
`;

export const SidebarUserMenuButton = styled.button<{ $is_collapsed: boolean }>`
  display: ${({ $is_collapsed }) => ($is_collapsed ? "none" : "inline-flex")};
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${colors.text_subtle};
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &:hover,
  &[aria-expanded="true"] {
    background: ${colors.navigation_hover_background};
    color: ${colors.text};
  }

`;
