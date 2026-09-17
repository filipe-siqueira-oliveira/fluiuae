import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, media_mobile } from "@/styles/typography";

const { colors, font_sizes } = theme_tokens;

export const SettingsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  && > section + section {
    margin-top: 12px;
  }

  ${media_mobile} {
    gap: 20px;
  }
`;

export const SettingsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px 24px;
  padding: 18px 0;

  & + & {
    border-top: 1px solid ${colors.border};
  }

  ${media_mobile} {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 0;
  }
`;

export const SettingsRowText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const SettingsRowTitle = styled.span`
  color: ${colors.text};
  font-size: ${font_sizes.body_large};
  font-weight: 500;
`;

export const SettingsRowDescription = styled.span`
  ${label_text}
  font-weight: 400;
  overflow-wrap: anywhere;
`;

export const SettingsRowControl = styled.div`
  flex-shrink: 0;

  ${media_mobile} {
    & > .ant-btn {
      width: 100%;
    }
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0 8px;
`;

export const ProfileName = styled.span`
  display: block;
  color: ${colors.text};
  font-family: ${theme_tokens.fonts.display};
  font-size: 20px;
  font-weight: 600;
`;

export const ProfileSince = styled.span`
  ${caption_text}
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;

  ${media_mobile} {
    & > .ant-btn {
      width: 100%;
    }
  }
`;

export const ThemeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: min(100%, 310px);

  ${media_mobile} {
    width: 100%;
  }
`;

export const ThemeOptionButton = styled.button<{ $is_selected: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 8px 10px;
  border: 1.5px solid ${({ $is_selected }) => ($is_selected ? colors.primary : colors.border)};
  border-radius: 14px;
  background: ${colors.surface};
  color: ${colors.text};
  font-family: inherit;
  font-size: ${font_sizes.caption};
  font-weight: ${({ $is_selected }) => ($is_selected ? 600 : 500)};
  cursor: pointer;

  &:hover {
    border-color: ${({ $is_selected }) => ($is_selected ? colors.primary : colors.border_strong)};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

export const ThemePreview = styled.span<{ $background: string; $surface: string; $line: string }>`
  display: grid;
  grid-template-columns: 26% 1fr;
  gap: 5px;
  height: 56px;
  padding: 6px;
  border-radius: 9px;
  background: ${({ $background }) => $background};

  &::before,
  &::after {
    content: "";
    border-radius: 5px;
    background: ${({ $surface }) => $surface};
    box-shadow: inset 0 0 0 1px ${({ $line }) => $line};
  }
`;

export const DisabledSection = styled.div`
  position: relative;
  opacity: 0.55;
  pointer-events: none;
  user-select: none;
`;
