"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { SidebarActionItem } from "@/components/layout/sidebar_action_item";
import { CoupleCalculatorModal } from "./couple_calculator_modal";
import type { WorkspaceSummaryDto } from "@/types/api";

type CoupleCalculatorShortcutProps = {
  is_collapsed: boolean;
  workspaces: WorkspaceSummaryDto[];
};

export const CoupleCalculatorShortcut = ({ is_collapsed, workspaces }: CoupleCalculatorShortcutProps) => {
  const [is_open, set_is_open] = useState(false);

  return (
    <>
      <SidebarActionItem
        icon={Calculator}
        label="Calculadora do casal"
        is_collapsed={is_collapsed}
        on_click={() => set_is_open(true)}
      />
      <CoupleCalculatorModal is_open={is_open} workspaces={workspaces} on_close={() => set_is_open(false)} />
    </>
  );
};
