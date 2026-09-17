import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { mobile_media } from "./sidebar_layout_styles";
import { sidebar_metrics } from "./sidebar_metrics";

const { colors } = theme_tokens;
const toggle_size = sidebar_metrics.collapse_toggle_size;

export const CollapseToggleButton = styled.button<{ $is_collapsed: boolean }>`
  position: fixed;
  top: ${sidebar_metrics.brand_height / 2 - toggle_size / 2}px;
  left: ${({ $is_collapsed }) =>
    `${($is_collapsed ? sidebar_metrics.collapsed_width : sidebar_metrics.expanded_width) - toggle_size / 2}px`};
  z-index: ${sidebar_metrics.collapse_toggle_z_index};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${toggle_size}px;
  height: ${toggle_size}px;
  padding: 0;
  border: 1px solid ${colors.border_strong};
  border-radius: 50%;
  background: ${colors.surface};
  box-shadow: ${theme_tokens.shadows.pressed_neutral};
  color: ${colors.text_muted};
  cursor: pointer;
  transition:
    left 200ms ease,
    color 150ms ease,
    border-color 150ms ease;

  &:hover {
    border-color: ${colors.text_subtle};
    color: ${colors.text};
  }

  ${mobile_media} {
    display: none;
  }
`;
