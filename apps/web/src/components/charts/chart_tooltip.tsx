"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors } = theme_tokens;

const TooltipFrame = styled.div`
  min-width: 150px;
  padding: 10px 12px;
  border: 1px solid ${colors.border};
  border-radius: 10px;
  background: ${colors.surface};
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.12);
  font-family: ${theme_tokens.fonts.primary};
`;

const TooltipTitle = styled.div`
  margin-bottom: 6px;
  color: ${colors.text_subtle};
  font-size: 12px;
`;

const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  & + & {
    margin-top: 4px;
  }
`;

const TooltipKey = styled.span<{ $color: string }>`
  width: 12px;
  height: 2px;
  border-radius: 1px;
  background: ${({ $color }) => $color};
`;

const TooltipValue = styled.strong`
  color: ${colors.text};
  font-size: 13px;
  font-variant-numeric: tabular-nums;
`;

const TooltipLabel = styled.span`
  color: ${colors.text_muted};
  font-size: 12px;
`;

export type ChartTooltipRow = {
  key: string;
  label: string;
  value: string;
  color: string;
};

type ChartTooltipProps = {
  title: string;
  rows: ChartTooltipRow[];
};

export const ChartTooltip = ({ title, rows }: ChartTooltipProps) => (
  <TooltipFrame>
    <TooltipTitle>{title}</TooltipTitle>
    {rows.map((row) => (
      <TooltipRow key={row.key}>
        <TooltipKey $color={row.color} />
        <TooltipValue>{row.value}</TooltipValue>
        <TooltipLabel>{row.label}</TooltipLabel>
      </TooltipRow>
    ))}
  </TooltipFrame>
);
