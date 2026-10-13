"use client";

import { Popconfirm } from "antd";
import { RotateCcw } from "lucide-react";
import { RowIconButton } from "@/components/actions/row_icon_button";
import { format_date } from "@/lib/date_formatter";
import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { describe_payment_kind } from "../../helpers/statement_payment_labels";
import {
  PaymentCreditAmount,
  PaymentRowValue,
  PurchaseDescription,
  PurchaseDot,
  PurchaseIdentity,
  PurchaseMeta,
  PurchaseRow,
} from "./statements_modal_styles";
import type { CreditCardStatementPaymentDto } from "@/types/api";

type StatementPaymentRowProps = {
  payment: CreditCardStatementPaymentDto;
  can_write: boolean;
  on_undo: (payment: CreditCardStatementPaymentDto) => void;
};

export const StatementPaymentRow = ({ payment, can_write, on_undo }: StatementPaymentRowProps) => (
  <PurchaseRow>
    <PurchaseDot $color={theme_tokens.colors.primary} aria-hidden="true" />
    <PurchaseIdentity>
      <PurchaseDescription>{describe_payment_kind(payment)}</PurchaseDescription>
      <PurchaseMeta>
        {format_date(payment.paid_at)} · {payment.account?.name ?? "conta excluída"}
      </PurchaseMeta>
    </PurchaseIdentity>
    <PaymentRowValue>
      <PaymentCreditAmount>{format_money(payment.amount)}</PaymentCreditAmount>
      <Popconfirm
        title="Desfazer este pagamento? O valor volta para a conta e fica em aberto na fatura."
        okText="Desfazer"
        cancelText="Voltar"
        onConfirm={() => on_undo(payment)}
        disabled={!can_write}
      >
        <RowIconButton label="Desfazer pagamento" icon={<RotateCcw size={16} />} disabled={!can_write} />
      </Popconfirm>
    </PaymentRowValue>
  </PurchaseRow>
);
