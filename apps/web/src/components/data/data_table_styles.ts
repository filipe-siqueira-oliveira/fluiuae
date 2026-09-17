import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

export const TableScroller = styled.div`
  overflow-x: auto;

  && table {
    min-width: 640px;
    font-family: ${theme_tokens.fonts.primary};
    font-variant-numeric: tabular-nums;
  }

  && th {
    height: 48px;
    border-bottom: 1px solid ${theme_tokens.colors.border};
    color: ${theme_tokens.colors.text_subtle};
    font-size: ${theme_tokens.font_sizes.caption};
    font-weight: 500;
    white-space: nowrap;
  }

  && td {
    height: 56px;
    border-bottom: 1px solid ${theme_tokens.colors.border};
    color: ${theme_tokens.colors.text};
    font-size: ${theme_tokens.font_sizes.body};
  }

  && tbody tr:last-child td {
    border-bottom: none;
  }

  && tbody tr:not([data-expanded-panel]):hover td {
    background: ${theme_tokens.colors.page_background};
  }

  && tbody tr[data-clickable] {
    cursor: pointer;
  }

  && tbody tr[data-clickable]:focus-visible {
    outline: 2px solid ${theme_tokens.colors.primary};
    outline-offset: -2px;
  }

  && tbody tr[data-expanded] td {
    border-bottom-color: transparent;
  }
`;

export const TableEmptyMessage = styled.p`
  margin: 0;
  padding: 32px 0 24px;
  color: ${theme_tokens.colors.text_muted};
  font-size: ${theme_tokens.font_sizes.body};
`;

export const ExpandToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid ${theme_tokens.colors.border_strong};
  border-radius: 8px;
  background: ${theme_tokens.colors.surface};
  color: ${theme_tokens.colors.text_muted};
  cursor: pointer;
  transition:
    border-color 150ms ease,
    color 150ms ease;

  &:hover,
  &[aria-expanded="true"] {
    border-color: ${theme_tokens.colors.text_subtle};
    color: ${theme_tokens.colors.text};
  }
`;

export const ExpandedCell = styled.td`
  && {
    height: auto;
    padding: 0;
    background: ${theme_tokens.colors.page_background};
  }
`;
