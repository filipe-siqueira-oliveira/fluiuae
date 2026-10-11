import { decode_payment_source } from "@/features/payment_sources/helpers/payment_source_value";
import { read_first_name } from "@/lib/person_name";
import type { FormRule } from "antd";
import type { SharedPurchaseParticipant } from "@/lib/shared_purchase_entries";
import type { WorkspaceSummaryDto } from "@/types/api";
import type { SharedPurchasePayload } from "../api/shared_purchase_api";
import type { ProportionalSplit } from "./proportional_split";

export type PaymentMode = "split" | "first_paid" | "second_paid";

export type SharedPurchaseFormValues = {
  description: string;
  first_workspace_id: string;
  second_workspace_id: string;
  first_payment_source: string;
  second_payment_source: string;
  payment_mode: PaymentMode;
};

export const distinct_workspace_rule: FormRule = ({ getFieldValue }) => ({
  validator: (_, second_workspace_id: string | undefined) =>
    second_workspace_id && second_workspace_id === getFieldValue("first_workspace_id")
      ? Promise.reject(new Error("Escolha uma carteira diferente para cada pessoa"))
      : Promise.resolve(),
});

const resolve_payer_workspace_id = (values: Partial<SharedPurchaseFormValues>): string | null => {
  if (values.payment_mode === "first_paid") {
    return values.first_workspace_id ?? null;
  }

  if (values.payment_mode === "second_paid") {
    return values.second_workspace_id ?? null;
  }

  return null;
};

const find_person_name = (workspaces: WorkspaceSummaryDto[], workspace_id: string | undefined, fallback: string) => {
  const workspace = workspaces.find((item) => item.id === workspace_id);

  return workspace ? read_first_name(workspace.owner_name) : fallback;
};

export const build_plan_input = (
  values: Partial<SharedPurchaseFormValues>,
  split: ProportionalSplit,
  workspaces: WorkspaceSummaryDto[]
) => {
  const participants: [SharedPurchaseParticipant, SharedPurchaseParticipant] = [
    {
      workspace_id: values.first_workspace_id ?? "",
      person_name: find_person_name(workspaces, values.first_workspace_id, "Pessoa 1"),
      amount: split.first_partner.installment_amount,
    },
    {
      workspace_id: values.second_workspace_id ?? "",
      person_name: find_person_name(workspaces, values.second_workspace_id, "Pessoa 2"),
      amount: split.second_partner.installment_amount,
    },
  ];

  return {
    description: values.description?.trim() || "Compra",
    payer_workspace_id: resolve_payer_workspace_id(values),
    installment_count: split.installment_count,
    participants,
  };
};

export const to_shared_purchase_payload = (
  values: SharedPurchaseFormValues,
  split: ProportionalSplit
): SharedPurchasePayload => ({
  description: values.description.trim(),
  payer_workspace_id: resolve_payer_workspace_id(values),
  installment_count: split.installment_count,
  shares: [
    {
      workspace_id: values.first_workspace_id,
      amount: split.first_partner.installment_amount,
      ...decode_payment_source(values.first_payment_source),
    },
    {
      workspace_id: values.second_workspace_id,
      amount: split.second_partner.installment_amount,
      ...decode_payment_source(values.second_payment_source),
    },
  ],
});
