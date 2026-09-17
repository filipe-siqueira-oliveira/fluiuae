"use client";

import { format_money } from "@/lib/money_formatter";
import { WidgetCard } from "../components/widget_card";
import { BigFigure, FigureCaption, StatGrid } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const DailyAverageWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const today_point = dashboard.daily_pace[dashboard.today_day - 1];
  const spent_so_far = Number(today_point?.current ?? 0);
  const average = spent_so_far / Math.max(dashboard.today_day, 1);
  const projection = average * dashboard.days_in_month;
  const previous_total = Number(dashboard.summary.previous_expense_total);

  return (
    <WidgetCard title="Média por dia" subtitle={`Nos ${dashboard.today_day} primeiros dias do mês`}>
      <BigFigure>{format_money(average)}</BigFigure>
      <FigureCaption>Gasto médio por dia até hoje</FigureCaption>
      <StatGrid>
        <div>
          <dt>Nesse ritmo, o mês fecha em</dt>
          <dd>{format_money(projection)}</dd>
        </div>
        <div>
          <dt>Mês passado inteiro</dt>
          <dd>{format_money(previous_total)}</dd>
        </div>
      </StatGrid>
    </WidgetCard>
  );
};
