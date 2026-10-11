import { describe_workspace_title } from "@/features/workspaces/helpers/workspace_labels";
import { describe_shared_value, type SharedPurchaseEntry } from "@/lib/shared_purchase_entries";
import { find_receiving_account_name, find_source_name } from "./share_payment_sources";
import type { PaymentSourcesByWorkspace } from "../hooks/use_workspace_payment_sources";
import type { WorkspaceSummaryDto } from "@/types/api";

export type SharedPurchasePreviewRow = {
  key: string;
  description: string;
  caption: string;
  amount_label: string;
  is_income: boolean;
};

type PreviewContext = {
  installment_count: number;
  workspaces: WorkspaceSummaryDto[];
  sources_by_workspace: PaymentSourcesByWorkspace;
  chosen_source_by_workspace: Record<string, string | undefined>;
};

const describe_kind = (entry: SharedPurchaseEntry, installment_count: number): string => {
  if (installment_count > 1) {
    return entry.kind === "receivable" ? "Parcelas a receber" : "Parcelas a pagar";
  }

  return entry.kind === "receivable" ? "Receita a receber" : "Despesa a pagar";
};

const describe_entry_source = (entry: SharedPurchaseEntry, context: PreviewContext): string | null => {
  const sources = context.sources_by_workspace[entry.workspace_id];
  const chosen_source = context.chosen_source_by_workspace[entry.workspace_id];

  return entry.kind === "receivable"
    ? find_receiving_account_name(sources, chosen_source)
    : find_source_name(sources, chosen_source);
};

const describe_workspace = (workspaces: WorkspaceSummaryDto[], workspace_id: string): string => {
  const workspace = workspaces.find((item) => item.id === workspace_id);

  return workspace ? describe_workspace_title(workspace) : "Carteira";
};

export const build_preview_rows = (
  entries: SharedPurchaseEntry[],
  context: PreviewContext
): SharedPurchasePreviewRow[] =>
  entries.map((entry, index) => {
    const source_name = describe_entry_source(entry, context);
    const caption_parts = [
      describe_kind(entry, context.installment_count),
      describe_workspace(context.workspaces, entry.workspace_id),
      source_name,
    ].filter(Boolean);
    const is_income = entry.kind === "receivable";

    return {
      key: `${entry.workspace_id}_${entry.kind}_${index}`,
      description: entry.description,
      caption: caption_parts.join(" · "),
      amount_label: `${is_income ? "+" : "−"} ${describe_shared_value(entry.amount, context.installment_count)}`,
      is_income,
    };
  });
