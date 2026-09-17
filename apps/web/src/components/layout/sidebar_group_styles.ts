import Link from "next/link";
import styled, { css } from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { flow_line_offset, sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;
const child_step = sidebar_metrics.child_height + sidebar_metrics.child_gap;
const node_size = 7;

export const SidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SidebarGroupRow = styled.div`
  position: relative;
`;

export const SidebarChevronButton = styled.button<{ $is_open: boolean }>`
  position: absolute;
  top: 50%;
  right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: ${colors.navigation_toggle_icon};
  cursor: pointer;
  transform: translateY(-50%);
  transition:
    background-color 150ms ease,
    color 150ms ease;

  svg {
    transform: rotate(${({ $is_open }) => ($is_open ? "180deg" : "0deg")});
    transition: transform 200ms ease;
  }

  &:hover {
    background: ${colors.surface};
    color: ${colors.navigation_icon};
  }
`;

export const SidebarFlowList = styled.div<{ $active_index: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${sidebar_metrics.child_gap}px;
  margin: 4px 0 6px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: ${flow_line_offset}px;
    width: 1.5px;
    border-radius: 1px;
  }

  &::before {
    bottom: 0;
    background: ${colors.border_strong};
  }

  &::after {
    display: ${({ $active_index }) => ($active_index >= 0 ? "block" : "none")};
    height: ${({ $active_index }) =>
      `${Math.max($active_index, 0) * child_step + sidebar_metrics.child_height / 2}px`};
    background: ${colors.primary};
    transition: height 240ms ease;
  }
`;

export const SidebarFlowLink = styled(Link)<{ $is_active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: ${sidebar_metrics.child_height}px;
  margin-left: ${flow_line_offset + 14}px;
  padding: 0 12px;
  border-radius: 10px;
  color: ${colors.navigation_text};
  font-size: ${theme_tokens.font_sizes.body};
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 150ms ease,
    color 150ms ease;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: ${-14 - node_size / 2 + 0.75}px;
    z-index: 1;
    width: ${node_size}px;
    height: ${node_size}px;
    border-radius: 50%;
    background: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.sidebar_background};
    opacity: 0;
    transform: translateY(-50%) scale(0.4);
    transition:
      opacity 200ms ease,
      transform 200ms ease;
  }

  &:hover {
    background: ${colors.navigation_hover_background};
    color: ${colors.navigation_text_active};
  }

  ${({ $is_active }) =>
    $is_active &&
    css`
      color: ${colors.navigation_text_active};
      font-weight: 600;

      &::before {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
    `}
`;

export const SidebarPopoverList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 196px;
  padding: 4px;
  font-family: ${theme_tokens.fonts.primary};
`;

export const SidebarPopoverTitle = styled(Link)`
  padding: 6px 10px 8px;
  color: ${colors.text_subtle};
  font-size: 13px;
  text-decoration: none;

  &:hover {
    color: ${colors.text};
  }
`;

export const SidebarPopoverLink = styled(Link)<{ $is_active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  color: ${({ $is_active }) => ($is_active ? colors.text : colors.navigation_text)};
  font-size: 14px;
  font-weight: ${({ $is_active }) => ($is_active ? 600 : 400)};
  text-decoration: none;

  &:hover {
    background: ${colors.navigation_hover_background};
    color: ${colors.text};
  }

  ${({ $is_active }) =>
    $is_active &&
    css`
      &::after {
        content: "";
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: ${colors.primary};
      }
    `}
`;
