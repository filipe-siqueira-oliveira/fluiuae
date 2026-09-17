import type { PartialTheme } from "@nivo/theming";
import { theme_tokens } from "@/styles/theme_tokens";

const { colors } = theme_tokens;

export const chart_colors = {
  balance: colors.primary,
  income: colors.income,
  expense: colors.danger,
  zero_line: colors.border_strong,
};

export const chart_theme: PartialTheme = {
  background: "transparent",
  text: {
    fontFamily: theme_tokens.fonts.primary,
    fontSize: 12,
    fill: colors.text_subtle,
  },
  axis: {
    domain: { line: { stroke: "transparent" } },
    ticks: {
      line: { stroke: "transparent" },
      text: { fill: colors.text_subtle, fontSize: 12, fontVariantNumeric: "tabular-nums" },
    },
  },
  grid: { line: { stroke: colors.border, strokeWidth: 1 } },
  crosshair: { line: { stroke: colors.text_subtle, strokeWidth: 1, strokeOpacity: 0.6, strokeDasharray: "0" } },
};
