import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, media_mobile } from "@/styles/typography";

const { colors, fonts, font_sizes, radii } = theme_tokens;

export const DayGroup = styled.section`
  padding-top: 20px;

  ${media_mobile} {
    padding-top: 16px;
  }
`;

export const DayHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 0 12px 6px;

  ${media_mobile} {
    padding: 0 4px 6px;
  }
`;

export const DayTitle = styled.h3`
  ${label_text}
  color: ${colors.text};
  font-weight: 600;
`;

export const DayTotal = styled.span<{ $is_negative: boolean }>`
  ${caption_text}
  color: ${({ $is_negative }) => ($is_negative ? colors.text_muted : colors.primary)};
  font-variant-numeric: tabular-nums;
`;

export const RowList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const RowItem = styled.li`
  position: relative;

  & + &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 12px;
    left: 68px;
    height: 1px;
    background: ${colors.border};
  }
`;

export const RowButton = styled.div<{ $is_clickable: boolean }>`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  grid-template-areas:
    "icon text value"
    "icon text actions";
  align-items: center;
  column-gap: 16px;
  row-gap: 4px;
  min-height: 68px;
  padding: 10px 12px;
  border-radius: ${radii.control};
  cursor: ${({ $is_clickable }) => ($is_clickable ? "pointer" : "default")};
  transition: background-color 150ms ease;

  &:hover {
    background: ${({ $is_clickable }) => ($is_clickable ? colors.navigation_hover_background : "transparent")};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }

  ${media_mobile} {
    grid-template-columns: 36px minmax(0, 1fr) auto;
    grid-template-areas:
      "icon text value"
      ". actions actions";
    column-gap: 12px;
    padding: 10px 4px;
  }
`;

export const TypeIcon = styled.span<{ $color: string }>`
  grid-area: icon;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => `color-mix(in srgb, ${$color} 13%, transparent)`};
  color: ${({ $color }) => $color};

  ${media_mobile} {
    width: 36px;
    height: 36px;
  }
`;

export const RowText = styled.span`
  grid-area: text;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
`;

export const RowDescription = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: ${font_sizes.body_large};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${media_mobile} {
    font-size: ${font_sizes.body};
  }
`;

export const RowMeta = styled.span`
  ${caption_text}
  overflow: hidden;
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RowValue = styled.span`
  grid-area: value;
  justify-self: end;
`;

export const RowAmount = styled.span<{ $color: string; $is_pending: boolean }>`
  color: ${({ $color }) => $color};
  font-family: ${fonts.display};
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  opacity: ${({ $is_pending }) => ($is_pending ? 0.75 : 1)};

  ${media_mobile} {
    font-size: 15px;
  }
`;

export const StatusActions = styled.span`
  grid-area: actions;
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${media_mobile} {
    justify-self: start;
  }
`;
