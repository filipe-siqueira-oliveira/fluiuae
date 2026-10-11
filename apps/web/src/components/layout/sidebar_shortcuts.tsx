"use client";

import { CoupleCalculatorShortcut } from "@/features/couple_calculator/components/couple_calculator_shortcut";
import { use_couple_calculator_in_sidebar } from "@/features/couple_calculator/hooks/use_couple_calculator_in_sidebar";
import { SidebarShortcutList } from "./sidebar_layout_styles";
import type { WorkspaceSummaryDto } from "@/types/api";

type SidebarShortcutsProps = {
  is_collapsed: boolean;
  workspaces: WorkspaceSummaryDto[];
};

export const SidebarShortcuts = ({ is_collapsed, workspaces }: SidebarShortcutsProps) => {
  const shows_couple_calculator = use_couple_calculator_in_sidebar();

  if (!shows_couple_calculator) {
    return null;
  }

  return (
    <SidebarShortcutList role="group" aria-label="Atalhos">
      <CoupleCalculatorShortcut is_collapsed={is_collapsed} workspaces={workspaces} />
    </SidebarShortcutList>
  );
};
