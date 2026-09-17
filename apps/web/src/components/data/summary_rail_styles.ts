import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, figure_text, label_text } from "@/styles/typography";

const { colors, radii } = theme_tokens;

export type SummaryTone = "neutral" | "positive" | "negative";

const tone_colors: Record<SummaryTone, string> = {
  neutral: colors.text,
  positive: colors.primary,
  negative: colors.danger,
};

export const RailFrame = styled.dl<{ $count: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  margin: 0;
  border: 1px solid ${colors.border};
  border-radius: ${radii.panel};
  background: ${colors.surface};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    border-radius: 16px;
  }
`;

export const RailSegment = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 20px 24px;

  & + & {
    border-left: 1px solid ${colors.border};
  }

  @media (max-width: 1180px) {
    padding: 18px 20px;
  }

  @media (max-width: 960px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: baseline;
    column-gap: 12px;
    padding: 14px 16px;

    & + & {
      border-top: 1px solid ${colors.border};
      border-left: none;
    }
  }
`;

export const RailLabel = styled.dt`
  ${label_text}
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    flex-shrink: 0;
    color: ${colors.text_subtle};
  }
`;

export const RailValue = styled.dd<{ $tone: SummaryTone }>`
  ${figure_text}
  color: ${({ $tone }) => tone_colors[$tone]};

  @media (max-width: 1180px) {
    font-size: 21px;
  }

  @media (max-width: 960px) {
    font-size: 20px;
    text-align: right;
  }
`;

export const RailContent = styled.dd`
  margin: 2px 0 0;
  min-width: 0;
  max-width: 420px;

  @media (max-width: 960px) {
    grid-column: 1 / -1;
    max-width: none;
    margin-top: 8px;
  }
`;

export const RailHint = styled.span`
  ${caption_text}

  @media (max-width: 960px) {
    grid-column: 1 / -1;
  }
`;
