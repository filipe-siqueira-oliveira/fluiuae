"use client";

import { Select } from "antd";
import {
  encode_payment_source,
  type PaymentSourceKind,
  type SelectablePaymentSource,
} from "../helpers/payment_source_value";
import { PaymentSourceLabel } from "./payment_source_label";

type PaymentSourceSelectProps = {
  id?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  accounts: SelectablePaymentSource[];
  credit_cards: SelectablePaymentSource[];
  allows_credit_card: boolean;
  placeholder?: string;
};

const to_options = (kind: PaymentSourceKind, sources: SelectablePaymentSource[]) =>
  sources.map((source) => ({
    value: encode_payment_source(kind, source.id),
    label: source.name,
    kind,
  }));

export const PaymentSourceSelect = ({
  id,
  value,
  onChange,
  accounts,
  credit_cards,
  allows_credit_card,
  placeholder = "Escolha uma conta ou um cartão",
}: PaymentSourceSelectProps) => {
  const account_group = { label: "Contas bancárias", options: to_options("account", accounts) };
  const credit_card_group = { label: "Cartões de crédito", options: to_options("credit_card", credit_cards) };
  const groups =
    allows_credit_card && credit_cards.length > 0 ? [account_group, credit_card_group] : [account_group];
  const all_options = groups.flatMap((group) => group.options);

  return (
    <Select<string>
      id={id}
      value={value}
      onChange={(next_value) => onChange?.(next_value)}
      options={groups}
      placeholder={placeholder}
      optionRender={(option) => {
        const kind = all_options.find((item) => item.value === option.value)?.kind ?? "account";

        return <PaymentSourceLabel kind={kind} name={String(option.label)} />;
      }}
      labelRender={(selected) => {
        const match = all_options.find((item) => item.value === selected.value);

        return match ? <PaymentSourceLabel kind={match.kind} name={match.label} /> : selected.label;
      }}
    />
  );
};
