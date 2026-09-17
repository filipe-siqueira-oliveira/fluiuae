"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import type { WidgetSpan } from "../helpers/widget_layout";

export const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const WidgetSlot = styled.div<{ $span: WidgetSpan; $tablet_span: WidgetSpan }>`
  grid-column: span ${({ $span }) => $span};
  min-width: 0;

  @media (max-width: 1100px) {
    grid-column: span ${({ $tablet_span }) => $tablet_span};
  }

  @media (max-width: 860px) {
    grid-column: span 12;
  }

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    grid-column: auto;
  }
`;
