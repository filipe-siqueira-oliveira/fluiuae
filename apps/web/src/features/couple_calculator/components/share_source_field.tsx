"use client";

import { Form } from "antd";
import { PaymentSourceSelect } from "@/features/payment_sources/components/payment_source_select";
import type { WorkspacePaymentSourcesDto } from "@/types/api";

type ShareSourceFieldProps = {
  name: "first_payment_source" | "second_payment_source";
  sources: WorkspacePaymentSourcesDto | undefined;
};

export const ShareSourceField = ({ name, sources }: ShareSourceFieldProps) => (
  <Form.Item name={name} label="Pagar com" rules={[{ required: true, message: "Escolha uma conta ou um cartão" }]}>
    <PaymentSourceSelect
      accounts={sources?.accounts ?? []}
      credit_cards={sources?.credit_cards ?? []}
      allows_credit_card
      placeholder={sources ? "Escolha uma conta ou um cartão" : "Carregando contas e cartões..."}
    />
  </Form.Item>
);
