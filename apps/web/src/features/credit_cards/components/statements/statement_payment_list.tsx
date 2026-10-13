"use client";

import { format_money } from "@/lib/money_formatter";
import { StatementPaymentRow } from "./statement_payment_row";
import { PurchaseDayGroup, PurchaseDayHeader, PurchaseDayLabel, PurchaseList } from "./statements_modal_styles";
import type { CreditCardStatementDetailDto, CreditCardStatementPaymentDto } from "@/types/api";

type StatementPaymentListProps = {
  statement: CreditCardStatementDetailDto;
  can_write: boolean;
  on_undo: (payment: CreditCardStatementPaymentDto) => void;
};

export const StatementPaymentList = ({ statement, can_write, on_undo }: StatementPaymentListProps) => (
  <PurchaseDayGroup aria-labelledby="statement_payments_heading">
    <PurchaseDayHeader>
      <PurchaseDayLabel id="statement_payments_heading">Pagamentos</PurchaseDayLabel>
      <span>{format_money(statement.paid_amount)}</span>
    </PurchaseDayHeader>
    <PurchaseList>
      {statement.payments.map((payment) => (
        <StatementPaymentRow key={payment.transaction_id} payment={payment} can_write={can_write} on_undo={on_undo} />
      ))}
    </PurchaseList>
  </PurchaseDayGroup>
);
