"use client";

import { TransactionStatus } from "@fluiuae/database/enums";
import { StatusPill } from "@/components/data/status_pill";
import { theme_tokens } from "@/styles/theme_tokens";
import { format_money } from "@/lib/money_formatter";
import {
  PurchaseAmount,
  PurchaseDescription,
  PurchaseDot,
  PurchaseIdentity,
  PurchaseMeta,
  PurchaseRow,
  PurchaseValue,
} from "./statements_modal_styles";
import type { TransactionDto } from "@/types/api";

type StatementPurchaseRowProps = {
  purchase: TransactionDto;
};

const describe_meta = (purchase: TransactionDto): string => {
  const category_name = purchase.category?.name ?? "Sem categoria";

  if (purchase.installment_number && purchase.installment_count) {
    return `${category_name}, parcela ${purchase.installment_number} de ${purchase.installment_count}`;
  }

  return category_name;
};

export const StatementPurchaseRow = ({ purchase }: StatementPurchaseRowProps) => {
  const is_paid = purchase.status === TransactionStatus.PAID;

  return (
    <PurchaseRow>
      <PurchaseDot $color={purchase.category?.color ?? theme_tokens.colors.border_strong} aria-hidden="true" />
      <PurchaseIdentity>
        <PurchaseDescription title={purchase.description}>{purchase.description}</PurchaseDescription>
        <PurchaseMeta>{describe_meta(purchase)}</PurchaseMeta>
      </PurchaseIdentity>
      <PurchaseValue>
        <PurchaseAmount>{format_money(-Number(purchase.amount))}</PurchaseAmount>
        <StatusPill tone={is_paid ? "income" : purchase.card_statement?.is_overdue ? "danger" : "pending"}>
          {is_paid ? "Paga" : purchase.card_statement?.is_overdue ? "Atrasada" : "A pagar"}
        </StatusPill>
      </PurchaseValue>
    </PurchaseRow>
  );
};
