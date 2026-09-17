import Link from "next/link";
import styled, { css } from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;

type RowProps = {
  $is_collapsed: boolean;
};

const sidebar_row = css<RowProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: ${({ $is_collapsed }) => ($is_collapsed ? "center" : "flex-start")};
  gap: 12px;
  width: 100%;
  height: ${sidebar_metrics.item_height}px;
  padding: 0 ${({ $is_collapsed }) => ($is_collapsed ? 0 : sidebar_metrics.item_padding)}px;
  border-radius: ${theme_tokens.radii.navigation_item};
  background: transparent;
  color: ${colors.navigation_text};
  font-family: inherit;
  font-size: ${theme_tokens.font_sizes.body};
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  svg {
    flex-shrink: 0;
    color: ${colors.navigation_icon};
    transition: color 150ms ease;
  }

  &:hover {
    background: ${colors.navigation_hover_background};
    color: ${colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

export const SidebarItemLink = styled(Link)<
  RowProps & { $is_active: boolean; $contains_active_child?: boolean; $has_chevron?: boolean }
>`
  ${sidebar_row}

  ${({ $has_chevron, $is_collapsed }) =>
    $has_chevron &&
    !$is_collapsed &&
    css`
      padding-right: 44px;
    `}

  ${({ $contains_active_child }) =>
    $contains_active_child &&
    css`
      color: ${colors.text};

      svg {
        color: ${colors.navigation_icon_active};
      }
    `}

  ${({ $is_active }) =>
    $is_active &&
    css`
      background: ${colors.navigation_active_background};
      color: ${colors.navigation_text_active};
      font-weight: 600;

      svg {
        color: ${colors.navigation_icon_active};
      }

      &:hover {
        background: ${colors.navigation_active_background};
        color: ${colors.navigation_text_active};
      }
    `}
`;
