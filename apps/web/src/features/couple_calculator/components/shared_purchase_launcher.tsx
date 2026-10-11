"use client";

import { useEffect, useState } from "react";
import { App, Button, Form, Input } from "antd";
import { ReceiptText } from "lucide-react";
import { useRouter } from "next/navigation";
import { describe_request_error } from "@/lib/http_client";
import { describe_shared_value, plan_shared_purchase_entries } from "@/lib/shared_purchase_entries";
import { create_shared_purchase_request } from "../api/shared_purchase_api";
import { use_workspace_payment_sources } from "../hooks/use_workspace_payment_sources";
import { contains_source, pick_default_source } from "../helpers/share_payment_sources";
import { build_preview_rows } from "../helpers/shared_purchase_preview_rows";
import {
  build_plan_input,
  distinct_workspace_rule,
  to_shared_purchase_payload,
  type SharedPurchaseFormValues,
} from "../helpers/shared_purchase_form_values";
import { pick_default_share_workspaces } from "../helpers/writable_workspaces";
import { LauncherDescription, LauncherHeading, LauncherPanel, ParticipantGrid } from "./couple_calculator_styles";
import { PaymentModeField } from "./payment_mode_field";
import { SharedPurchasePreview } from "./shared_purchase_preview";
import { ShareParticipantFields } from "./share_participant_fields";
import type { ProportionalSplit } from "../helpers/proportional_split";
import type { WorkspaceSummaryDto } from "@/types/api";

type SharedPurchaseLauncherProps = {
  split: ProportionalSplit;
  writable_workspaces: WorkspaceSummaryDto[];
  on_launched: () => void;
};

type SourceFieldName = "first_payment_source" | "second_payment_source";

export const SharedPurchaseLauncher = ({ split, writable_workspaces, on_launched }: SharedPurchaseLauncherProps) => {
  const [form] = Form.useForm<SharedPurchaseFormValues>();
  const [is_submitting, set_is_submitting] = useState(false);
  const { message } = App.useApp();
  const router = useRouter();
  const initial_values = { ...pick_default_share_workspaces(writable_workspaces), payment_mode: "split" as const };
  const description = Form.useWatch("description", form);
  const first_workspace_id = Form.useWatch("first_workspace_id", form) ?? initial_values.first_workspace_id;
  const second_workspace_id = Form.useWatch("second_workspace_id", form) ?? initial_values.second_workspace_id;
  const first_payment_source = Form.useWatch("first_payment_source", form);
  const second_payment_source = Form.useWatch("second_payment_source", form);
  const payment_mode = Form.useWatch("payment_mode", form) ?? initial_values.payment_mode;
  const sources_by_workspace = use_workspace_payment_sources([first_workspace_id, second_workspace_id]);
  const first_sources = first_workspace_id ? sources_by_workspace[first_workspace_id] : undefined;
  const second_sources = second_workspace_id ? sources_by_workspace[second_workspace_id] : undefined;

  useEffect(() => {
    const keep_source_in_workspace = (field_name: SourceFieldName, sources: typeof first_sources) => {
      if (sources && !contains_source(sources, form.getFieldValue(field_name))) {
        form.setFieldValue(field_name, pick_default_source(sources));
      }
    };

    keep_source_in_workspace("first_payment_source", first_sources);
    keep_source_in_workspace("second_payment_source", second_sources);
  }, [first_sources, second_sources, form]);

  const plan_input = build_plan_input(
    { description, first_workspace_id, second_workspace_id, payment_mode },
    split,
    writable_workspaces
  );
  const preview_rows = build_preview_rows(plan_shared_purchase_entries(plan_input), {
    installment_count: split.installment_count,
    workspaces: writable_workspaces,
    sources_by_workspace,
    chosen_source_by_workspace: {
      ...(first_workspace_id ? { [first_workspace_id]: first_payment_source } : {}),
      ...(second_workspace_id ? { [second_workspace_id]: second_payment_source } : {}),
    },
  });

  const launch = async (values: SharedPurchaseFormValues) => {
    set_is_submitting(true);

    try {
      await create_shared_purchase_request(to_shared_purchase_payload(values, split));
      message.success("Lançamentos criados nas duas carteiras");
      router.refresh();
      on_launched();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  return (
    <LauncherPanel>
      <LauncherHeading>Lançar nas carteiras</LauncherHeading>
      <LauncherDescription>
        Tudo entra pendente: cada um confirma na própria carteira quando o dinheiro sair ou entrar. Compra parcelada
        vira recorrência, com a 1ª parcela hoje.
      </LauncherDescription>
      <Form form={form} layout="vertical" requiredMark={false} initialValues={initial_values} onFinish={launch}>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, whitespace: true, message: "Informe uma descrição" }]}
        >
          <Input placeholder="Geladeira, viagem, mercado do mês..." maxLength={200} />
        </Form.Item>
        <ParticipantGrid>
          <ShareParticipantFields
            heading={`Pessoa 1 · ${describe_shared_value(split.first_partner.installment_amount, split.installment_count)}`}
            workspace_name="first_workspace_id"
            source_name="first_payment_source"
            workspaces={writable_workspaces}
            sources={first_sources}
          />
          <ShareParticipantFields
            heading={`Pessoa 2 · ${describe_shared_value(split.second_partner.installment_amount, split.installment_count)}`}
            workspace_name="second_workspace_id"
            source_name="second_payment_source"
            workspaces={writable_workspaces}
            sources={second_sources}
            workspace_dependencies={["first_workspace_id"]}
            workspace_rules={[distinct_workspace_rule]}
          />
        </ParticipantGrid>
        <PaymentModeField participants={plan_input.participants} installment_count={split.installment_count} />
        <SharedPurchasePreview rows={preview_rows} />
        <Button type="primary" htmlType="submit" loading={is_submitting} icon={<ReceiptText size={16} />}>
          Lançar
        </Button>
      </Form>
    </LauncherPanel>
  );
};
