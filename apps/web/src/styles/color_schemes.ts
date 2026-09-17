export const light_colors = {
  page_background: "#F3F6F4",
  surface: "#FFFFFF",
  text: "#14231C",
  text_muted: "#4B5B53",
  text_subtle: "#66756D",
  border: "#E3E9E5",
  border_strong: "#CFD9D3",
  primary: "#0E7A4E",
  primary_pressed: "#0A5C3B",
  primary_deep: "#0A3B28",
  on_primary: "#FFFFFF",
  income: "#0E7A4E",
  income_soft: "#E4F2EA",
  income_border: "#8CCBAE",
  pending: "#B54708",
  pending_soft: "#FEF4E6",
  pending_border: "#F7C98B",
  danger: "#B42318",
  danger_soft: "#FDECEA",
  danger_border: "#F2A7A4",
  neutral_soft: "#EAF0EC",
  muted_icon: "#9AA8A0",
  sidebar_background: "#FFFFFF",
  navigation_text: "#4B5B53",
  navigation_text_active: "#0A3B28",
  navigation_icon: "#4B5B53",
  navigation_icon_active: "#0E7A4E",
  navigation_toggle_icon: "#9AA8A0",
  navigation_hover_background: "#EAF0EC",
  navigation_active_background: "#E4F2EA",
  navigation_active_border: "transparent",
  translucent_bar: "rgba(255, 255, 255, 0.92)",
  shadow_ink: "rgba(20, 35, 28, 0.08)",
  chart_income: "#157F5B",
  chart_expense: "#B8421C",
  chart_muted: "#9AA8A0",
  chart_grid: "#E3E9E5",
} as const;

export type ColorName = keyof typeof light_colors;

export const dark_colors: Record<ColorName, string> = {
  page_background: "#0E1411",
  surface: "#151D19",
  text: "#E6EEE9",
  text_muted: "#A7B4AC",
  text_subtle: "#8A978F",
  border: "#25302A",
  border_strong: "#35423B",
  primary: "#34B27A",
  primary_pressed: "#2A9565",
  primary_deep: "#C9EEDB",
  on_primary: "#06140D",
  income: "#4CC38A",
  income_soft: "#16362A",
  income_border: "#2E6A4E",
  pending: "#F2A54E",
  pending_soft: "#382915",
  pending_border: "#6E4E22",
  danger: "#F27B70",
  danger_soft: "#3B1C1A",
  danger_border: "#7A3A35",
  neutral_soft: "#1E2823",
  muted_icon: "#6F7C74",
  sidebar_background: "#121915",
  navigation_text: "#A7B4AC",
  navigation_text_active: "#D6F2E3",
  navigation_icon: "#A7B4AC",
  navigation_icon_active: "#4CC38A",
  navigation_toggle_icon: "#6F7C74",
  navigation_hover_background: "#1C2621",
  navigation_active_background: "#173A29",
  navigation_active_border: "transparent",
  translucent_bar: "rgba(18, 25, 21, 0.9)",
  shadow_ink: "rgba(0, 0, 0, 0.35)",
  chart_income: "#3BA372",
  chart_expense: "#DD6B3F",
  chart_muted: "#5E6B64",
  chart_grid: "#25302A",
};

const to_variable_name = (name: string): string => `--color_${name}`;

export const color_variables = Object.fromEntries(
  Object.keys(light_colors).map((name) => [name, `var(${to_variable_name(name)})`])
) as Record<ColorName, string>;

export const build_color_declarations = (scheme: Record<ColorName, string>): string =>
  Object.entries(scheme)
    .map(([name, value]) => `${to_variable_name(name)}: ${value};`)
    .join("\n");
