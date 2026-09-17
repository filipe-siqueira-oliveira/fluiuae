"use client";

import dayjs from "dayjs";
import styled from "styled-components";
import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { caption_text, label_text, media_mobile } from "@/styles/typography";
import { MeterFill, MeterTrack } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

const { colors, fonts, font_sizes } = theme_tokens;

const SummaryFrame = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 32px 48px;
  height: 100%;
  padding: 28px 32px;
  border: 1px solid ${colors.border};
  border-radius: ${theme_tokens.radii.panel};
  background: ${colors.surface};

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
  }

  ${media_mobile} {
    padding: 20px;
  }
`;

const Lead = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const LeadLabel = styled.h2`
  ${label_text}
  font-size: ${font_sizes.body_large};
`;

const LeadFigure = styled.strong<{ $is_negative: boolean }>`
  color: ${({ $is_negative }) => ($is_negative ? colors.danger : colors.text)};
  font-family: ${fonts.display};
  font-size: clamp(40px, 5.2vw, 60px);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const LeadNote = styled.p`
  ${label_text}
  font-weight: 400;
  max-width: 44ch;
`;

const Flows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 22px;
`;

const FlowHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const FlowName = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: ${colors.text};
  font-size: ${font_sizes.body};
  font-weight: 500;
`;

const FlowKey = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: ${({ $color }) => $color};
`;

const FlowValue = styled.span`
  color: ${colors.text};
  font-family: ${fonts.display};
  font-size: 19px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const FlowDetail = styled.span`
  ${caption_text}
  display: block;
  margin-top: 6px;
`;

const Legend = styled.span`
  ${caption_text}
  display: flex;
  gap: 16px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

type MonthSummaryWidgetProps = {
  dashboard: DashboardDto;
};

const describe_pending = (pending: number, verb: string): string =>
  pending > 0 ? `${format_money(pending)} ainda ${verb}` : "Nada previsto a mais";

export const MonthSummaryWidget = ({ dashboard }: MonthSummaryWidgetProps) => {
  const month_name = dayjs(dashboard.month_start).format("MMMM");
  const income_paid = Number(dashboard.summary.income.paid);
  const income_pending = Number(dashboard.summary.income.pending);
  const expense_paid = Number(dashboard.summary.expense.paid);
  const expense_pending = Number(dashboard.summary.expense.pending);
  const result = income_paid - expense_paid;
  const projected = income_paid + income_pending - expense_paid - expense_pending;
  const scale = Math.max(income_paid + income_pending, expense_paid + expense_pending, 1);

  const flows = [
    { key: "income", name: "Receitas", color: colors.chart_income, paid: income_paid, pending: income_pending, verb: "a receber" },
    { key: "expense", name: "Despesas", color: colors.chart_expense, paid: expense_paid, pending: expense_pending, verb: "a pagar" },
  ];

  return (
    <SummaryFrame aria-labelledby="month_summary_title" data-tour="home_summary">
      <Lead>
        <LeadLabel id="month_summary_title">{result < 0 ? `Faltou em ${month_name}` : `Sobrou em ${month_name}`}</LeadLabel>
        <LeadFigure $is_negative={result < 0}>{format_money(Math.abs(result))}</LeadFigure>
        <LeadNote>
          Com o que ainda vai entrar e sair até o fim do mês, fica em{" "}
          <strong>{format_money(projected)}</strong>.
        </LeadNote>
      </Lead>
      <Flows>
        {flows.map((flow) => (
          <div key={flow.key}>
            <FlowHeader>
              <FlowName>
                <FlowKey $color={flow.color} aria-hidden="true" />
                {flow.name}
              </FlowName>
              <FlowValue>{format_money(flow.paid)}</FlowValue>
            </FlowHeader>
            <MeterTrack aria-hidden="true">
              <MeterFill $share={flow.paid / scale} $color={flow.color} />
              <MeterFill $share={flow.pending / scale} $color={flow.color} $is_wash />
            </MeterTrack>
            <FlowDetail>{describe_pending(flow.pending, flow.verb)}</FlowDetail>
          </div>
        ))}
        <Legend aria-hidden="true">
          <span>
            <FlowKey $color={colors.text_subtle} /> Já efetivado
          </span>
          <span>
            <FlowKey $color={`color-mix(in srgb, ${colors.text_subtle} 32%, transparent)`} /> Previsto
          </span>
        </Legend>
      </Flows>
    </SummaryFrame>
  );
};
