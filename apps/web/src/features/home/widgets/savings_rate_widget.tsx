"use client";

import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { WidgetCard } from "../components/widget_card";
import { BigFigure, FigureCaption, MeterFill, MeterTrack, StatGrid, WidgetEmpty } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const SavingsRateWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const income = Number(dashboard.summary.income.paid) + Number(dashboard.summary.income.pending);
  const expense = Number(dashboard.summary.expense.paid) + Number(dashboard.summary.expense.pending);
  const kept = income - expense;
  const rate = income > 0 ? kept / income : 0;
  const history = dashboard.cash_flow.filter((month) => Number(month.income) > 0);
  const average_rate =
    history.length > 0
      ? history.reduce((sum, month) => sum + (Number(month.income) - Number(month.expense)) / Number(month.income), 0) /
        history.length
      : 0;

  return (
    <WidgetCard title="Quanto sobrou" subtitle="Parte das receitas do mês que ficou com você">
      {income === 0 ? (
        <WidgetEmpty>Sem receitas neste mês para comparar.</WidgetEmpty>
      ) : (
        <>
          <BigFigure $tone={rate < 0 ? "negative" : "positive"}>{Math.round(rate * 100)}%</BigFigure>
          <FigureCaption>
            {kept >= 0 ? `${format_money(kept)} de ${format_money(income)}` : `Gastou ${format_money(-kept)} a mais do que recebeu`}
          </FigureCaption>
          <MeterTrack style={{ marginTop: 14 }} aria-hidden="true">
            <MeterFill $share={Math.max(rate, 0)} $color={theme_tokens.colors.chart_income} />
          </MeterTrack>
          <StatGrid>
            <div>
              <dt>Média de 6 meses</dt>
              <dd>{Math.round(average_rate * 100)}%</dd>
            </div>
            <div>
              <dt>Despesas do mês</dt>
              <dd>{format_money(expense)}</dd>
            </div>
          </StatGrid>
        </>
      )}
    </WidgetCard>
  );
};
