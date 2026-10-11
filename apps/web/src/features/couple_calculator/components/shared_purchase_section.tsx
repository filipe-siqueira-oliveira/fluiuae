"use client";

import { list_writable_workspaces } from "../helpers/writable_workspaces";
import { SharedPurchaseLauncher } from "./shared_purchase_launcher";
import type { ProportionalSplit } from "../helpers/proportional_split";
import type { WorkspaceSummaryDto } from "@/types/api";

type SharedPurchaseSectionProps = {
  split: ProportionalSplit;
  workspaces: WorkspaceSummaryDto[];
  on_launched: () => void;
};

export const SharedPurchaseSection = ({ split, workspaces, on_launched }: SharedPurchaseSectionProps) => {
  const writable_workspaces = list_writable_workspaces(workspaces);

  if (writable_workspaces.length < 2) {
    return null;
  }

  return <SharedPurchaseLauncher split={split} writable_workspaces={writable_workspaces} on_launched={on_launched} />;
};
