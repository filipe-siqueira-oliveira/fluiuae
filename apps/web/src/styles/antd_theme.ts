import { theme, type ThemeConfig } from "antd";
import { dark_colors, light_colors, type ColorName } from "./color_schemes";
import { theme_tokens } from "./theme_tokens";

export type ResolvedTheme = "light" | "dark";

const build_theme = (colors: Record<ColorName, string>, mode: ResolvedTheme): ThemeConfig => ({
  algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.income,
    colorWarning: colors.pending,
    colorError: colors.danger,
    colorText: colors.text,
    colorTextSecondary: colors.text_muted,
    colorTextTertiary: colors.text_subtle,
    colorBorder: colors.border_strong,
    colorBorderSecondary: colors.border,
    colorBgLayout: colors.page_background,
    colorBgContainer: colors.surface,
    colorBgElevated: colors.surface,
    colorTextLightSolid: colors.on_primary,
    fontFamily: theme_tokens.fonts.primary,
    fontSize: 14,
    borderRadius: 10,
    borderRadiusSM: 8,
    borderRadiusLG: 14,
    controlHeight: 40,
    controlHeightSM: 32,
  },
  components: {
    Button: {
      fontWeight: 600,
      paddingInline: 16,
      primaryShadow: `0 1px 0 ${colors.primary_pressed}`,
      defaultShadow: `0 1px 0 ${colors.border_strong}`,
      dangerShadow: "none",
    },
    Modal: {
      titleFontSize: 20,
      borderRadiusLG: 20,
      paddingContentHorizontalLG: 28,
      contentBg: colors.surface,
      headerBg: colors.surface,
      footerBg: colors.surface,
    },
    Form: {
      labelColor: colors.text_muted,
      verticalLabelPadding: "0 0 6px",
    },
    Select: {
      optionSelectedBg: colors.income_soft,
      optionSelectedColor: colors.text,
      optionActiveBg: colors.neutral_soft,
    },
    Segmented: {
      itemSelectedColor: colors.text,
      trackBg: colors.neutral_soft,
      trackPadding: 3,
    },
    Tooltip: {
      colorBgSpotlight: mode === "dark" ? colors.border_strong : colors.text,
    },
  },
});

export const antd_themes: Record<ResolvedTheme, ThemeConfig> = {
  light: build_theme(light_colors, "light"),
  dark: build_theme(dark_colors, "dark"),
};
