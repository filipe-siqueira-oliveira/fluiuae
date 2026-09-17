"use client";

import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { WidgetCard } from "../components/widget_card";
import { BigFigure, FigureCaption, MeterFill, MeterTrack, StatGrid } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const FixedCommitmentsWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const fixed_expense = Number(dashboard.fixed_commitments.fixed_expense_total);
  const installments = Number(dashboard.fixed_commitments.installments_month_total);
  const committed = fixed_expense + installments;
  const reference_income =
    Number(dashboard.fixed_commitments.fixed_income_total) ||
    Number(dashboard.summary.income.paid) + Number(dashboard.summary.income.pending);
  const ratio = reference_income > 0 ? committed / reference_income : 0;

  return (
    <WidgetCard title="Compromissos fixos" subtitle="Despesas fixas e parcelas de todo mês">
      <BigFigure>{format_money(committed)}</BigFigure>
      <FigureCaption>
        {reference_income > 0 ? `${Math.round(ratio * 100)}% da sua renda do mês` : "Cadastre suas receitas fixas para comparar"}
      </FigureCaption>
      <MeterTrack style={{ marginTop: 14 }} aria-hidden="true">
        <MeterFill
          $share={ratio}
          $color={ratio >= 0.7 ? theme_tokens.colors.danger : ratio >= 0.5 ? theme_tokens.colors.pending : theme_tokens.colors.primary}
        />
      </MeterTrack>
      <StatGrid>
        <div>
          <dt>Despesas fixas</dt>
          <dd>{format_money(fixed_expense)}</dd>
        </div>
        <div>
          <dt>Parcelas</dt>
          <dd>{format_money(installments)}</dd>
        </div>
      </StatGrid>
    </WidgetCard>
  );
};
