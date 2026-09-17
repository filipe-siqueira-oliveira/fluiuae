"use client";

import { Button, Popconfirm } from "antd";
import { format_date } from "@/lib/date_formatter";
import { format_money } from "@/lib/money_formatter";
import { split_money } from "../../helpers/money_parts";
import { format_statement_day, format_statement_short_month } from "../../helpers/statement_labels";
import {
  describe_statement_list_state,
  has_statement_charges,
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
  on_undo: (statement: CreditCardStatementDetailDto) => void;
};

const describe_purchase_count = (count: number): string => (count === 1 ? "1 compra" : `${count} compras`);

const describe_commitments = (commitments: CreditCardCommitmentsDto): string => {
  const installments = commitments.installment_count === 1 ? "1 parcela" : `${commitments.installment_count} parcelas`;

  return `${format_money(commitments.remaining_amount)} · ${installments} de ${describe_purchase_count(commitments.purchase_count)}`;
};

export const StatementOverview = ({ statement, commitments, can_write, on_pay, on_undo }: StatementOverviewProps) => {
  const tone = resolve_statement_list_tone(statement);
  const amount = split_money(statement.total);
  const short_month = format_statement_short_month(statement.due_date);

  return (
    <OverviewBlock aria-label={`Resumo da fatura ${short_month}`}>
      <OverviewEyebrow>Fatura · {short_month}</OverviewEyebrow>
      <OverviewAmount aria-label={format_money(statement.total)}>
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
        {statement.payment ? (
          <OverviewPaid>
            paga em {format_date(statement.payment.paid_at)} com {statement.payment.account?.name ?? "conta excluída"}
          </OverviewPaid>
        ) : has_statement_charges(statement) ? (
          <>
            {" "}
            · pendente
            <OverviewPending>{format_money(statement.total)}</OverviewPending>
          </>
        ) : null}
      </OverviewDates>
      <OverviewBreakdown>
        {describe_purchase_count(statement.purchases.length)} somando {format_money(statement.total)}
      </OverviewBreakdown>
      {commitments && commitments.installment_count > 0 ? (
        <OverviewCommitments>
          <strong>Compromissos futuros deste cartão</strong> — {describe_commitments(commitments)}
        </OverviewCommitments>
      ) : null}
      <OverviewActions>
        {statement.payment ? (
          <Popconfirm
            title="Desfazer o pagamento? O valor volta para a conta e a fatura fica em aberto."
            okText="Desfazer"
            cancelText="Voltar"
            onConfirm={() => on_undo(statement)}
            disabled={!can_write}
          >
            <Button disabled={!can_write}>Desfazer pagamento</Button>
          </Popconfirm>
        ) : has_statement_charges(statement) ? (
          <Button type="primary" disabled={!can_write} onClick={() => on_pay(statement)}>
            Pagar fatura
          </Button>
        ) : null}
      </OverviewActions>
    </OverviewBlock>
  );
};
