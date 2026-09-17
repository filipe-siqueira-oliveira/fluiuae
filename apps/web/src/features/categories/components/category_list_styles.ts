import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, media_mobile } from "@/styles/typography";

const { colors, font_sizes, radii } = theme_tokens;

export const CategorySectionBlock = styled.section`
  padding-top: 20px;

  & + & {
    margin-top: 8px;
  }

  ${media_mobile} {
    padding-top: 16px;
  }
`;

export const CategorySectionHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 10px;
  margin-bottom: 12px;
`;

export const CategorySectionTitle = styled.h3`
  ${label_text}
  color: ${colors.text};
  font-weight: 600;
`;

export const CategorySectionHint = styled.p`
  ${caption_text}
`;

export const CategoryList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const CategoryRowItem = styled.li<{ $is_locked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 52px;
  padding: 0 6px 0 14px;
  border: 1px solid ${colors.border};
  border-radius: ${radii.control};
  background: ${({ $is_locked }) => ($is_locked ? colors.page_background : colors.surface)};
  transition: border-color 150ms ease;

  &:has(button:not(:disabled)):hover {
    border-color: ${colors.border_strong};
    background: ${colors.navigation_hover_background};
  }
`;

export const CategoryRowButton = styled.button`
  display: flex;
  align-items: center;
  align-self: stretch;
  flex: 1;
  min-width: 0;
  margin: -1px -7px -1px -15px;
  padding: 0 14px;
  border: none;
  border-radius: ${radii.control};
  background: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }
`;

export const CategoryIdentity = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const CategoryDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 3px ${({ $color }) => `color-mix(in srgb, ${$color} 14%, transparent)`};
`;

export const CategoryName = styled.span`
  overflow: hidden;
  color: ${colors.text};
  font-size: ${font_sizes.body};
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CategoryLockedMark = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${colors.navigation_toggle_icon};
`;

export const CategoryEmptyMessage = styled.p`
  ${label_text}
  font-weight: 400;
  padding: 4px 0 8px;
`;

export const KindCount = styled.span`
  margin-left: 6px;
  color: ${colors.text_subtle};
  font-size: ${font_sizes.micro};
  font-variant-numeric: tabular-nums;
`;

export const SegmentedSlot = styled.div`
  ${media_mobile} {
    width: 100%;

    .ant-segmented {
      display: flex;
      width: 100%;
    }

    .ant-segmented-item {
      flex: 1;
    }
  }
`;
