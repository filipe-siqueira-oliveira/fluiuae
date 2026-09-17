import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, media_mobile } from "@/styles/typography";
import type { StatementListTone } from "../../helpers/statement_status_labels";

const { colors, fonts, font_sizes, radii } = theme_tokens;

const tone_colors: Record<StatementListTone, string> = {
  paid: colors.primary,
  overdue: colors.danger,
  pending: colors.pending,
  open: colors.text,
  muted: colors.text_subtle,
};

export const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
  padding-right: 24px;
  border-right: 1px solid ${colors.border};

  ${media_mobile} {
    gap: 20px;
    max-height: none;
    padding-right: 0;
    overflow: visible;
    border-right: none;
  }
`;

export const StatementRows = styled.ul`
  max-height: 260px;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  border-top: 1px solid ${colors.border};
  list-style: none;
  overscroll-behavior: contain;

  ${media_mobile} {
    max-height: 216px;
  }
`;

export const StatementRowButton = styled.button<{ $tone: StatementListTone; $is_selected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 52px;
  padding: 0 4px 0 18px;
  border: none;
  border-bottom: 1px solid ${colors.border};
  background: ${({ $is_selected }) => ($is_selected ? colors.navigation_hover_background : "transparent")};
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 12px;
    bottom: 12px;
    left: 0;
    width: ${({ $is_selected }) => ($is_selected ? "4px" : "3px")};
    border-radius: 2px;
    background: ${({ $tone }) => tone_colors[$tone]};
  }

  &:hover {
    background: ${colors.navigation_hover_background};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

export const StatementRowLabel = styled.span<{ $tone: StatementListTone }>`
  color: ${({ $tone }) => tone_colors[$tone]};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const StatementRowAmount = styled.span`
  color: ${colors.text};
  font-size: ${font_sizes.body_large};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const OverviewBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const OverviewEyebrow = styled.h3`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0;
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;

  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${colors.border};
  }
`;

export const OverviewAmount = styled.p`
  display: flex;
  align-items: baseline;
  margin: 0;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;
`;

export const OverviewCurrency = styled.span`
  margin-right: 4px;
  color: ${colors.text_muted};
  font-size: 28px;
  font-weight: 500;
  align-self: flex-start;
  padding-top: 10px;
`;

export const OverviewInteger = styled.span`
  font-size: clamp(52px, 6vw, 76px);
  font-weight: 700;
  letter-spacing: -0.045em;
`;

export const OverviewCents = styled.span`
  color: ${colors.text_muted};
  font-size: 28px;
  font-weight: 500;
`;

export const OverviewBadge = styled.span<{ $tone: StatementListTone }>`
  align-self: flex-start;
  padding: 4px 12px;
  border: 1.5px solid ${({ $tone }) => tone_colors[$tone]};
  border-radius: ${radii.small};
  color: ${({ $tone }) => tone_colors[$tone]};
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
`;

export const OverviewDates = styled.p`
  margin: 0;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body_large};
  line-height: 1.5;

  strong {
    color: ${colors.text};
    font-weight: 600;
  }
`;

export const OverviewPending = styled.span`
  display: block;
  color: ${colors.danger};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

export const OverviewPaid = styled.span`
  display: block;
  color: ${colors.primary};
  font-weight: 500;
`;

export const OverviewBreakdown = styled.p`
  ${caption_text}
  font-size: ${font_sizes.caption};
  color: ${colors.text_muted};
`;

export const OverviewCommitments = styled.p`
  margin: 0;
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
  line-height: 1.5;

  strong {
    color: ${colors.text_muted};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

export const OverviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  & > * {
    flex: 1;
  }
`;
