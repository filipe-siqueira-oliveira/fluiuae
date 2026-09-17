import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, media_mobile } from "@/styles/typography";

const { colors, fonts, font_sizes, radii } = theme_tokens;

export const AgendaList = styled.ul`
  margin: 0;
  padding: 8px 0 0;
  list-style: none;
`;

export const AgendaRowButton = styled.button`
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 76px;
  padding: 12px;
  border: none;
  border-radius: ${radii.control};
  background: transparent;
  color: ${colors.text};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 150ms ease;

  &:hover:not(:disabled) {
    background: ${colors.navigation_hover_background};
  }

  &:disabled {
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: -2px;
  }

  ${media_mobile} {
    grid-template-columns: 44px minmax(0, 1fr) auto;
    gap: 12px;
    padding: 12px 4px;
  }
`;

export const AgendaRowItem = styled.li`
  & + & {
    border-top: 1px solid ${colors.border};
  }
`;

export const AgendaText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const AgendaDescription = styled.span`
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

export const AgendaMeta = styled.span`
  ${caption_text}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 14px;
  font-size: ${font_sizes.caption};
  color: ${colors.text_muted};

  & > span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  & > span > span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  ${media_mobile} {
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-start;
    gap: 2px;
  }
`;

export const AgendaValue = styled.span`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

export const AgendaAmount = styled.span`
  font-family: ${fonts.display};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  ${media_mobile} {
    font-size: 16px;
  }
`;

export const AgendaCaption = styled.span<{ $is_highlighted?: boolean }>`
  ${caption_text}
  color: ${({ $is_highlighted }) => ($is_highlighted ? colors.primary : colors.text_subtle)};
  font-weight: ${({ $is_highlighted }) => ($is_highlighted ? 600 : 400)};
  white-space: nowrap;
`;
