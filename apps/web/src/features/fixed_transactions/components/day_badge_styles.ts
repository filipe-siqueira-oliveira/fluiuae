import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { media_mobile } from "@/styles/typography";

const { colors, fonts } = theme_tokens;

export type DayBadgeState = "passed" | "next" | "upcoming";

const badge_styles: Record<DayBadgeState, { border: string; background: string; color: string }> = {
  passed: { border: "transparent", background: colors.page_background, color: colors.text_subtle },
  next: { border: colors.primary, background: colors.income_soft, color: colors.primary_deep },
  upcoming: { border: colors.border_strong, background: colors.surface, color: colors.text },
};

export const DayBadge = styled.span<{ $state: DayBadgeState }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border: 1.5px solid ${({ $state }) => badge_styles[$state].border};
  border-radius: 14px;
  background: ${({ $state }) => badge_styles[$state].background};
  color: ${({ $state }) => badge_styles[$state].color};

  ${media_mobile} {
    width: 44px;
    height: 44px;
    border-radius: 12px;
  }
`;

export const DayBadgeLabel = styled.span`
  color: inherit;
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  opacity: 0.7;
`;

export const DayBadgeNumber = styled.span`
  font-family: ${fonts.display};
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;

  ${media_mobile} {
    font-size: 17px;
  }
`;
