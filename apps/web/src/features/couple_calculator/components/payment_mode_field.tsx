"use client";

import { Form, Radio } from "antd";
import { describe_shared_value, type SharedPurchaseParticipant } from "@/lib/shared_purchase_entries";
import type { PaymentMode } from "../helpers/shared_purchase_form_values";

type PaymentModeFieldProps = {
  participants: [SharedPurchaseParticipant, SharedPurchaseParticipant];
  installment_count: number;
};

export const PaymentModeField = ({ participants: [first, second], installment_count }: PaymentModeFieldProps) => {
  const describe_single_payer = (payer: SharedPurchaseParticipant, debtor: SharedPurchaseParticipant): string =>
    `${payer.person_name} pagou tudo e ${debtor.person_name} devolve ${describe_shared_value(debtor.amount, installment_count)}`;

  const options: { value: PaymentMode; label: string }[] = [
    { value: "split", label: "Cada um pagou a sua parte" },
    { value: "first_paid", label: describe_single_payer(first, second) },
    { value: "second_paid", label: describe_single_payer(second, first) },
  ];

  return (
    <Form.Item name="payment_mode" label="Quem pagou a compra?">
      <Radio.Group options={options} style={{ display: "flex", flexDirection: "column", gap: 8 }} />
    </Form.Item>
  );
};
