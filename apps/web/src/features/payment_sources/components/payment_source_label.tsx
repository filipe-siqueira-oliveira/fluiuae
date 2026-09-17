"use client";

import styled from "styled-components";
import { CreditCard, Landmark } from "lucide-react";
import { theme_tokens } from "@/styles/theme_tokens";
import type { PaymentSourceKind } from "../helpers/payment_source_value";

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  svg {
    flex-shrink: 0;
    color: ${theme_tokens.colors.text_subtle};
  }
`;

type PaymentSourceLabelProps = {
  kind: PaymentSourceKind;
  name: string;
};

export const PaymentSourceLabel = ({ kind, name }: PaymentSourceLabelProps) => (
  <Label>
    {kind === "credit_card" ? (
      <CreditCard size={14} strokeWidth={1.75} aria-label="Cartão de crédito" />
    ) : (
      <Landmark size={14} strokeWidth={1.75} aria-label="Conta bancária" />
    )}
    <span>{name}</span>
  </Label>
);
