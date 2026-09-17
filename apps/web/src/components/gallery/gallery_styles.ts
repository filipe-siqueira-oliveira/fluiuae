import styled from "styled-components";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors, font_sizes } = theme_tokens;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 380px), 1fr));
  gap: 24px;
  padding: 24px 0 4px;

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    gap: 16px;
    padding-top: 16px;
  }
`;

export const TileFrame = styled.div`
  position: relative;
  container: gallery_tile / inline-size;
  align-self: start;
  width: 100%;
  min-width: 0;
  max-width: 460px;
  justify-self: center;
  border-radius: 18px;
`;

export const TileEditButton = styled.button`
  position: absolute;
  z-index: 1;
  inset: 0;
  padding: 0;
  border: none;
  border-radius: 18px;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid ${colors.primary};
    outline-offset: 3px;
  }
`;

export const AddTileButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 460px;
  min-height: 236px;
  justify-self: center;
  align-self: stretch;
  padding: 20px;
  border: 1.5px dashed ${colors.border_strong};
  border-radius: 18px;
  background: transparent;
  color: ${colors.text};
  font-family: inherit;
  text-align: center;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${colors.primary};
    background: ${colors.page_background};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    flex-direction: row;
    justify-content: flex-start;
    gap: 14px;
    min-height: 0;
    padding: 14px 16px;
    text-align: left;

    & > span:last-child {
      display: none;
    }
  }
`;

export const AddTileIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-bottom: 2px;
  border: 1.5px dashed ${colors.border_strong};
  border-radius: 50%;
  color: ${colors.text_muted};
`;

export const AddTileTitle = styled.span`
  color: ${colors.text};
  font-family: ${theme_tokens.fonts.display};
  font-size: ${theme_tokens.font_sizes.section_title};
  font-weight: 600;
  letter-spacing: -0.01em;
`;

export const AddTileDescription = styled.span`
  color: ${colors.text_muted};
  font-size: ${font_sizes.body};
`;
