"use client";

import { Button } from "antd";
import { format_date } from "@/lib/date_formatter";
import { format_money } from "@/lib/money_formatter";
import { split_money } from "../../helpers/money_parts";
import { is_advance_payment_flow, resolve_last_payment } from "../../helpers/statement_payment_labels";
import { format_statement_day, format_statement_short_month } from "../../helpers/statement_labels";
import {
  can_pay_statement,
  describe_statement_list_state,
  is_statement_paid,
  resolve_statement_display_amount,
  resolve_statement_list_tone,
} from "../../helpers/statement_status_labels";
import {
  OverviewActions,
  OverviewAmount,
  OverviewBadge,
  OverviewBlock,
  OverviewBreakdown,
  OverviewCents,
  OverviewCommitments,
  OverviewCurrency,
  OverviewDates,
  OverviewEyebrow,
  OverviewInteger,
  OverviewPaid,
  OverviewPending,
} from "./statement_side_styles";
import type { CreditCardCommitmentsDto, CreditCardStatementDetailDto } from "@/types/api";

type StatementOverviewProps = {
  statement: CreditCardStatementDetailDto;
  commitments: CreditCardCommitmentsDto | null;
  can_write: boolean;
  on_pay: (statement: CreditCardStatementDetailDto) => void;
};

const describe_purchase_count = (count: number): string => (count === 1 ? "1 compra" : `${count} compras`);

const describe_commitments = (commitments: CreditCardCommitmentsDto): string => {
  const installments = commitments.installment_count === 1 ? "1 parcela" : `${commitments.installment_count} parcelas`;

  return `${format_money(commitments.remaining_amount)} · ${installments} de ${describe_purchase_count(commitments.purchase_count)}`;
};

const describe_breakdown = (statement: CreditCardStatementDetailDto): string => {
  const purchases = `${describe_purchase_count(statement.purchases.length)} somando ${format_money(statement.total)}`;

  return Number(statement.paid_amount) > 0 ? `${purchases} · ${format_money(statement.paid_amount)} já pago` : purchases;
};

export const StatementOverview = ({ statement, commitments, can_write, on_pay }: StatementOverviewProps) => {
  const tone = resolve_statement_list_tone(statement);
  const display_amount = resolve_statement_display_amount(statement);
  const amount = split_money(display_amount);
  const short_month = format_statement_short_month(statement.due_date);
  const last_payment = resolve_last_payment(statement);

  return (
    <OverviewBlock aria-label={`Resumo da fatura ${short_month}`}>
      <OverviewEyebrow>Fatura · {short_month}</OverviewEyebrow>
      <OverviewAmount aria-label={format_money(display_amount)}>
        <OverviewCurrency aria-hidden="true">
          {amount.sign}
          {amount.currency}
        </OverviewCurrency>
        <OverviewInteger aria-hidden="true">{amount.integer}</OverviewInteger>
        <OverviewCents aria-hidden="true">{amount.cents}</OverviewCents>
      </OverviewAmount>
      <OverviewBadge $tone={tone}>{describe_statement_list_state(statement)}</OverviewBadge>
      <OverviewDates>
        vence <strong>{format_statement_day(statement.due_date)}</strong> · fecha{" "}
        {format_statement_day(statement.closing_date)}
        {is_statement_paid(statement) && last_payment ? (
          <OverviewPaid>paga em {format_date(last_payment.paid_at)}</OverviewPaid>
        ) : Number(statement.remaining_amount) > 0 ? (
          <>
            {" "}
            · pendente
            <OverviewPending>{format_money(statement.remaining_amount)}</OverviewPending>
          </>
        ) : null}
      </OverviewDates>
      <OverviewBreakdown>{describe_breakdown(statement)}</OverviewBreakdown>
      {commitments && commitments.installment_count > 0 ? (
        <OverviewCommitments>
          <strong>Compromissos futuros deste cartão</strong> — {describe_commitments(commitments)}
        </OverviewCommitments>
      ) : null}
      {can_pay_statement(statement) ? (
        <OverviewActions>
          <Button type="primary" disabled={!can_write} onClick={() => on_pay(statement)}>
            {is_advance_payment_flow(statement) ? "Antecipar pagamento" : "Pagar fatura"}
          </Button>
        </OverviewActions>
      ) : null}
    </OverviewBlock>
  );
};
