import { css } from "styled-components";
import { theme_tokens } from "./theme_tokens";

const { colors, fonts, font_sizes } = theme_tokens;

export const media_mobile = `@media (max-width: ${theme_tokens.layout.mobile_breakpoint}px)`;

export const page_title_text = css`
  margin: 0;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: ${font_sizes.page_title};
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.025em;

  ${media_mobile} {
    font-size: 27px;
  }
`;

export const section_title_text = css`
  margin: 0;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: ${font_sizes.section_title};
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

export const figure_text = css`
  margin: 0;
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: ${font_sizes.figure};
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const lead_text = css`
  margin: 0;
  color: ${colors.text_muted};
  font-size: ${font_sizes.body_large};
  line-height: 1.5;
`;

export const label_text = css`
  margin: 0;
  color: ${colors.text_muted};
  font-size: ${font_sizes.caption};
  font-weight: 500;
  line-height: 1.4;
`;

export const caption_text = css`
  margin: 0;
  color: ${colors.text_subtle};
  font-size: ${font_sizes.micro};
  line-height: 1.4;
`;
