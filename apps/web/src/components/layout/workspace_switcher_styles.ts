import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;

export const SwitcherSlot = styled.div`
  flex-shrink: 0;
  margin-bottom: 12px;
`;

export const SwitcherTrigger = styled.button<{ $is_collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $is_collapsed }) => ($is_collapsed ? "center" : "flex-start")};
  gap: 10px;
  width: 100%;
  min-height: ${sidebar_metrics.item_height + 12}px;
  padding: ${({ $is_collapsed }) => ($is_collapsed ? "0" : "6px 8px 6px 10px")};
  border: 1px solid ${colors.border};
  border-radius: ${theme_tokens.radii.control};
  background: ${colors.surface};
  color: ${colors.text};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  &:hover,
  &[aria-expanded="true"] {
    border-color: ${colors.border_strong};
    background: ${colors.navigation_hover_background};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: progress;
    opacity: 0.7;
  }
`;

export const SwitcherIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${colors.income_soft};
  color: ${colors.primary};
`;

export const SwitcherText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const SwitcherTitle = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SwitcherCaption = styled.span`
  overflow: hidden;
  color: ${colors.text_subtle};
  font-size: 12px;
  line-height: 1.3;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SwitcherChevron = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  color: ${colors.text_subtle};
`;

export const OptionRow = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
  padding: 4px 0;
`;

export const OptionCheck = styled.span<{ $is_visible: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  width: 16px;
  color: ${colors.primary};
  visibility: ${({ $is_visible }) => ($is_visible ? "visible" : "hidden")};
`;
