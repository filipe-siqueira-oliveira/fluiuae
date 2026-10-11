"use client";

import { Tooltip } from "antd";
import { SidebarItemButton } from "./sidebar_item_styles";
import { SidebarLabel } from "./sidebar_layout_styles";
import { sidebar_metrics } from "./sidebar_metrics";
import type { LucideIcon } from "lucide-react";

type SidebarActionItemProps = {
  icon: LucideIcon;
  label: string;
  is_collapsed: boolean;
  on_click: () => void;
};

export const SidebarActionItem = ({ icon: Icon, label, is_collapsed, on_click }: SidebarActionItemProps) => (
  <Tooltip title={is_collapsed ? label : null} placement="right">
    <SidebarItemButton
      type="button"
      $is_collapsed={is_collapsed}
      aria-label={label}
      aria-haspopup="dialog"
      onClick={on_click}
    >
      <Icon size={sidebar_metrics.icon_size} strokeWidth={1.75} />
      <SidebarLabel $is_collapsed={is_collapsed}>{label}</SidebarLabel>
    </SidebarItemButton>
  </Tooltip>
);
