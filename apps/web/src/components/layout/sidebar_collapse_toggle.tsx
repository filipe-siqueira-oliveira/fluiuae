"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollapseToggleButton } from "./sidebar_collapse_toggle_styles";

type SidebarCollapseToggleProps = {
  is_collapsed: boolean;
  on_toggle: () => void;
};

export const SidebarCollapseToggle = ({ is_collapsed, on_toggle }: SidebarCollapseToggleProps) => {
  const [is_mounted, set_is_mounted] = useState(false);

  useEffect(() => {
    set_is_mounted(true);
  }, []);

  if (!is_mounted) {
    return null;
  }

  const Icon = is_collapsed ? ChevronRight : ChevronLeft;
  const label = is_collapsed ? "Expandir menu" : "Recolher menu";

  return createPortal(
    <CollapseToggleButton
      type="button"
      $is_collapsed={is_collapsed}
      onClick={on_toggle}
      aria-label={label}
      title={label}
      aria-expanded={!is_collapsed}
    >
      <Icon size={14} strokeWidth={2.25} />
    </CollapseToggleButton>,
    document.body
  );
};
