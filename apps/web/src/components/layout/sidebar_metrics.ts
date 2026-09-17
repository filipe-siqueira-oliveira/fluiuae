export const sidebar_metrics = {
  expanded_width: 256,
  collapsed_width: 72,
  mobile_breakpoint: 768,
  horizontal_padding: 12,
  item_height: 40,
  item_padding: 12,
  icon_size: 18,
  child_height: 34,
  child_gap: 2,
  brand_height: 76,
  collapse_toggle_size: 24,
  logo_placeholder_inset: 12,
  collapse_toggle_z_index: 1100,
  mobile_bar_height: 60,
} as const;

const item_border_width = 0;
const flow_line_half_width = 0.75;

export const flow_line_offset =
  item_border_width + sidebar_metrics.item_padding + sidebar_metrics.icon_size / 2 - flow_line_half_width;
