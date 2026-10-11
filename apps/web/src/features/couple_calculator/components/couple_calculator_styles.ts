import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, figure_text, label_text, media_mobile, section_title_text } from "@/styles/typography";

const { colors, fonts, font_sizes, radii } = theme_tokens;

export const IntroText = styled.p`
  margin: 0 0 20px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  line-height: 1.5;
`;

export const FieldPairGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  ${media_mobile} {
    grid-template-columns: 1fr;
  }
`;

export const PurchaseGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0 12px;
`;

export const ResultAnchor = styled.div`
  scroll-margin-top: 8px;
`;

export const ParticipantGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  ${media_mobile} {
    grid-template-columns: 1fr;
    gap: 4px;
  }
`;

export const ParticipantGroup = styled.div`
  min-width: 0;
`;

export const ParticipantHeading = styled.p`
  ${label_text}
  margin-bottom: 8px;
  color: ${colors.text};
  font-weight: 600;
`;

export const SalaryGroup = styled.div`
  margin-bottom: 24px;
`;

export const ResultPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.panel};
  background: ${colors.page_background};

  ${media_mobile} {
    padding: 16px;
  }
`;

export const ResultHeading = styled.h3`
  ${label_text}
`;

export const StatList = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 0;

  ${media_mobile} {
    grid-template-columns: 1fr;
  }
`;

export const PurchaseSummaryList = styled(StatList)`
  padding-bottom: 16px;
  border-bottom: 1px solid ${colors.border};
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SummaryLabel = styled.dt`
  ${label_text}
`;

export const SummaryValue = styled.dd`
  ${section_title_text}
  font-variant-numeric: tabular-nums;
`;

export const SplitBar = styled.div`
  display: flex;
  gap: 2px;
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.neutral_soft};
`;

export const SplitSegment = styled.div<{ $share: number; $color: string }>`
  width: ${({ $share }) => `${Math.max(0, Math.min($share, 1)) * 100}%`};
  background: ${({ $color }) => $color};
`;

export const PartnerLabel = styled.dt`
  ${label_text}
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PartnerDot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

export const PartnerAmount = styled.dd`
  ${figure_text}
`;

export const AmountUnit = styled.span`
  margin-left: 4px;
  color: ${colors.text_subtle};
  font-family: ${fonts.primary};
  font-size: ${font_sizes.caption};
  font-weight: 500;
  letter-spacing: 0;
`;

export const PartnerCaption = styled.dd`
  ${caption_text}
`;

export const ResultFootnote = styled.p`
  ${caption_text}
`;

export const LauncherPanel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.panel};
  background: ${colors.surface};

  ${media_mobile} {
    padding: 16px;
  }
`;

export const LauncherHeading = styled.h3`
  ${section_title_text}
  font-size: ${font_sizes.body_large};
`;

export const LauncherDescription = styled.p`
  margin: 0 0 12px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
  line-height: 1.5;
`;

export const PreviewBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const PreviewHeading = styled.p`
  ${label_text}
`;

export const PreviewList = styled.ul`
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 1px solid ${colors.border};
  border-radius: ${radii.small};
  list-style: none;
`;

export const PreviewItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;

  & + & {
    border-top: 1px solid ${colors.border};
  }

  ${media_mobile} {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
`;

export const PreviewText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const PreviewDescription = styled.span`
  color: ${colors.text};
  font-size: ${font_sizes.body};
  font-weight: 500;
  overflow-wrap: anywhere;
`;

export const PreviewCaption = styled.span`
  ${caption_text}
`;

export const PreviewAmount = styled.span<{ $is_income: boolean }>`
  color: ${({ $is_income }) => ($is_income ? colors.income : colors.text)};
  font-size: ${font_sizes.body};
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;