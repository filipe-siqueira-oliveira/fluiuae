import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, figure_text, label_text } from "@/styles/typography";

const { colors, fonts, font_sizes } = theme_tokens;

export const BigFigure = styled.strong<{ $tone?: "positive" | "negative" | "neutral" }>`
  ${figure_text}
  font-size: 30px;
  color: ${({ $tone }) => ($tone === "negative" ? colors.danger : $tone === "positive" ? colors.primary : colors.text)};
`;

export const FigureCaption = styled.p`
  ${label_text}
  font-weight: 400;
  margin-top: 6px;
`;

export const WidgetEmpty = styled.p`
  ${label_text}
  font-weight: 400;
  margin: auto 0;
  padding: 16px 0;
  color: ${colors.text_subtle};
`;

export const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ItemRow = styled.li`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 0;

  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

export const ItemIdentity = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const ItemText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

export const ItemTitle = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: ${font_sizes.body};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemMeta = styled.span`
  ${caption_text}
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ItemAmount = styled.span<{ $tone?: "income" | "danger" | "neutral" }>`
  color: ${({ $tone }) => ($tone === "income" ? colors.income : $tone === "danger" ? colors.danger : colors.text)};
  font-family: ${fonts.display};
  font-size: 15px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  text-align: right;
`;

export const Dot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const MeterTrack = styled.div`
  display: flex;
  gap: 2px;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.neutral_soft};
`;

export const MeterFill = styled.div<{ $share: number; $color: string; $is_wash?: boolean }>`
  width: ${({ $share }) => `${Math.max(0, Math.min($share, 1)) * 100}%`};
  border-radius: 999px;
  background: ${({ $color, $is_wash }) => ($is_wash ? `color-mix(in srgb, ${$color} 32%, transparent)` : $color)};
`;

export const StatGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: auto 0 0;
  padding-top: 16px;

  dt {
    ${caption_text}
  }

  dd {
    margin: 2px 0 0;
    color: ${colors.text};
    font-family: ${fonts.display};
    font-size: 17px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;
