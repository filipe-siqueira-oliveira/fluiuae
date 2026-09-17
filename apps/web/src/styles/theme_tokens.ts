import { color_variables } from "./color_schemes";

export const theme_tokens = {
  colors: color_variables,
  radii: {
    small: "8px",
    control: "10px",
    navigation_item: "10px",
    panel: "18px",
  },
  font_sizes: {
    micro: "12px",
    caption: "13px",
    body: "14px",
    body_large: "16px",
    section_title: "18px",
    figure: "24px",
    page_title: "32px",
    statement: "30px",
  },
  shadows: {
    pressed_neutral: `0 1px 0 ${color_variables.border_strong}`,
    pressed_primary: `0 1px 0 ${color_variables.primary_pressed}`,
    raised: "0 1px 2px rgba(20, 35, 28, 0.04), 0 8px 24px -12px rgba(20, 35, 28, 0.12)",
  },
  fonts: {
    primary: "var(--font_primary), system-ui, -apple-system, sans-serif",
    display: "var(--font_display), var(--font_primary), system-ui, sans-serif",
  },
  layout: {
    content_max_width: "1200px",
    mobile_breakpoint: 768,
  },
} as const;
