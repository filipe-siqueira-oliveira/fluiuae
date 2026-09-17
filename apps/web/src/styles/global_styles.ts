"use client";

import { createGlobalStyle } from "styled-components";
import { build_color_declarations, dark_colors, light_colors } from "./color_schemes";
import { theme_tokens } from "./theme_tokens";

export const GlobalStyles = createGlobalStyle`
  :root {
    ${build_color_declarations(light_colors)}
    color-scheme: light;
  }

  :root[data-theme="dark"] {
    ${build_color_declarations(dark_colors)}
    color-scheme: dark;
  }

  html,
  body {
    background: ${theme_tokens.colors.page_background};
    color: ${theme_tokens.colors.text};
    font-family: ${theme_tokens.fonts.primary};
    -webkit-font-smoothing: antialiased;
  }

  body {
    margin: 0;
    font-size: ${theme_tokens.font_sizes.body};
    text-rendering: optimizeLegibility;
  }

  .ant-modal .ant-modal-title,
  .ant-drawer .ant-drawer-title {
    font-family: ${theme_tokens.fonts.display};
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  @media (max-width: ${theme_tokens.layout.mobile_breakpoint}px) {
    .ant-modal {
      max-width: calc(100vw - 24px);
      margin: 12px auto;
    }

    .ant-modal .ant-modal-content {
      padding: 20px 16px;
    }
  }

  :focus-visible {
    outline: 2px solid ${theme_tokens.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      transition-duration: 0ms !important;
      animation-duration: 0ms !important;
    }
  }
`;
