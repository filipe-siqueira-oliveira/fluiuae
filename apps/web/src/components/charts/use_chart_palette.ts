"use client";

import { useMemo } from "react";
import type { PartialTheme } from "@nivo/theming";
import { use_theme_preference } from "@/providers/theme_preference_provider";
import { dark_colors, light_colors } from "@/styles/color_schemes";
import { theme_tokens } from "@/styles/theme_tokens";

export const use_chart_palette = () => {
  const { resolved_theme } = use_theme_preference();

  return useMemo(() => {
    const scheme = resolved_theme === "dark" ? dark_colors : light_colors;
    const nivo_theme: PartialTheme = {
      background: "transparent",
      text: { fontFamily: theme_tokens.fonts.primary, fontSize: 12, fill: scheme.text_subtle },
      axis: {
        domain: { line: { stroke: "transparent" } },
        ticks: { line: { stroke: "transparent" }, text: { fill: scheme.text_subtle, fontSize: 12 } },
      },
      grid: { line: { stroke: scheme.chart_grid, strokeWidth: 1 } },
      crosshair: { line: { stroke: scheme.text_subtle, strokeWidth: 1, strokeOpacity: 0.5, strokeDasharray: "0" } },
    };

    return { scheme, nivo_theme };
  }, [resolved_theme]);
};
