import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, figure_text, label_text, media_mobile } from "@/styles/typography";

const { colors, fonts, font_sizes } = theme_tokens;

const brand_green = (alpha: number): string => `rgba(14, 122, 78, ${alpha})`;

export const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 420px), 1fr));
  gap: 20px;
  padding: 24px 0 4px;

  & > * {
    max-width: none;
  }

  & > button {
    min-height: 196px;
  }

  ${media_mobile} {
    gap: 12px;
    padding-top: 12px;

    & > button {
      min-height: 0;
    }
  }
`;

export const CardFrame = styled.article<{ $is_archived: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
  min-height: 196px;
  padding: 20px 22px 18px;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background:
    radial-gradient(120% 90% at 0% 0%, ${brand_green(0.1)}, transparent 60%),
    ${colors.surface};
  opacity: ${({ $is_archived }) => ($is_archived ? 0.6 : 1)};
  transition: border-color 150ms ease;

  button:hover + & {
    border-color: ${colors.border_strong};
  }

  ${media_mobile} {
    gap: 16px;
    min-height: 0;
    padding: 16px;
  }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 560px) {
    flex-direction: column;
    gap: 14px;
  }
`;

export const CardIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
  max-width: 100%;
`;

export const LogoRing = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  padding: 3px;
  border: 1.5px solid ${brand_green(0.35)};
  border-radius: 50%;
  background: ${brand_green(0.08)};

  @media (max-width: 560px) {
    & > span {
      width: 38px;
      height: 38px;
    }
  }
`;

export const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const CardName = styled.h3`
  margin: 0;
  overflow: hidden;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardTags = styled.span`
  ${label_text}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
`;

export const CardOrigin = styled.span`
  ${caption_text}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CardBalanceColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;

  @media (max-width: 560px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    width: 100%;
    column-gap: 12px;
    row-gap: 2px;

    & > svg {
      grid-column: 2;
      grid-row: 1 / span 2;
    }
  }
`;

export const CardBalance = styled.strong<{ $is_negative: boolean }>`
  ${figure_text}
  color: ${({ $is_negative }) => ($is_negative ? colors.danger : colors.text)};
`;

export const CardBalanceNote = styled.span`
  ${caption_text}
  white-space: nowrap;
`;

export const FlowTrack = styled.div`
  display: flex;
  gap: 2px;
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.border};
`;

export const FlowIncome = styled.div<{ $share: number }>`
  width: ${({ $share }) => `${$share * 100}%`};
  border-radius: 999px;
  background: ${colors.income};
`;

export const FlowExpense = styled.div<{ $share: number }>`
  width: ${({ $share }) => `${$share * 100}%`};
  border-radius: 999px;
  background: ${colors.primary_deep};
`;

export const FlowLegend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 12px;
  margin-top: 10px;
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
  font-variant-numeric: tabular-nums;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  strong {
    color: ${colors.text};
    font-weight: 600;
  }
`;

export const CardBottom = styled.div`
  margin-top: auto;
`;
