"use client";

import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { media_mobile } from "@/styles/typography";

const { colors, fonts } = theme_tokens;

export type ProgressRingTone = "active" | "done" | "waiting";

const tone_colors: Record<ProgressRingTone, string> = {
  active: colors.primary,
  done: colors.muted_icon,
  waiting: colors.border_strong,
};

const RingFrame = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;

  svg {
    position: absolute;
    inset: 0;
    transform: rotate(-90deg);
  }

  ${media_mobile} {
    width: 44px;
    height: 44px;
  }
`;

const RingLabel = styled.span<{ $tone: ProgressRingTone }>`
  position: relative;
  color: ${({ $tone }) => ($tone === "active" ? colors.text : colors.text_subtle)};
  font-family: ${fonts.display};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;

  ${media_mobile} {
    font-size: 11px;
  }
`;

type ProgressRingProps = {
  value: number;
  total: number;
  tone: ProgressRingTone;
  label: string;
};

const radius = 22;
const circumference = 2 * Math.PI * radius;

export const ProgressRing = ({ value, total, tone, label }: ProgressRingProps) => {
  const share = total > 0 ? Math.min(Math.max(value / total, 0), 1) : 0;

  return (
    <RingFrame role="img" aria-label={label}>
      <svg viewBox="0 0 52 52" width="100%" height="100%" aria-hidden="true">
        <circle cx="26" cy="26" r={radius} fill="none" style={{ stroke: colors.border }} strokeWidth="4" />
        <circle
          cx="26"
          cy="26"
          r={radius}
          fill="none"
          style={{ stroke: tone_colors[tone] }}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${circumference * share} ${circumference}`}
        />
      </svg>
      <RingLabel $tone={tone} aria-hidden="true">
        {value}/{total}
      </RingLabel>
    </RingFrame>
  );
};
