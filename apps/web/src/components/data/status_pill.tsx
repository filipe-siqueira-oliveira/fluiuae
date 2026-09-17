"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

export type StatusPillTone = "income" | "pending" | "danger" | "neutral";

const tone_colors: Record<StatusPillTone, { text: string; background: string }> = {
  income: { text: theme_tokens.colors.income, background: theme_tokens.colors.income_soft },
  pending: { text: theme_tokens.colors.pending, background: theme_tokens.colors.pending_soft },
  danger: { text: theme_tokens.colors.danger, background: theme_tokens.colors.danger_soft },
  neutral: { text: theme_tokens.colors.text_muted, background: theme_tokens.colors.neutral_soft },
};

const Pill = styled.span<{ $tone: StatusPillTone }>`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${({ $tone }) => tone_colors[$tone].background};
  color: ${({ $tone }) => tone_colors[$tone].text};
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
`;

type StatusPillProps = {
  tone: StatusPillTone;
  children: React.ReactNode;
};

export const StatusPill = ({ tone, children }: StatusPillProps) => (
  <Pill $tone={tone}>{children}</Pill>
);
