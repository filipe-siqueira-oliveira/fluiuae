"use client";

import dayjs from "dayjs";
import { ResponsiveLine } from "@nivo/line";
import { ChartCard } from "@/components/charts/chart_card";
import { ChartDataTable, ChartPlotArea } from "@/components/charts/chart_card_styles";
import { format_compact_money } from "@/components/charts/chart_formatters";
import { ChartLegend } from "@/components/charts/chart_legend";
import { ChartTooltip } from "@/components/charts/chart_tooltip";
import { use_chart_palette } from "@/components/charts/use_chart_palette";
import { format_money } from "@/lib/money_formatter";
import type { DashboardDto } from "@/types/api";

export const DailyPaceWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const { scheme, nivo_theme } = use_chart_palette();
  const month = dayjs(dashboard.month_start);
  const previous_month = month.subtract(1, "month");
  const current_label = month.format("MMMM");
  const previous_label = previous_month.format("MMMM");
  const today_point = dashboard.daily_pace[dashboard.today_day - 1];
  const previous_same_day = Number(today_point?.previous ?? 0);
  const current_so_far = Number(today_point?.current ?? 0);
  const difference = current_so_far - previous_same_day;
  const subtitle =
    previous_same_day === 0 && current_so_far === 0
      ? "Nenhuma despesa até agora"
      : `Até o dia ${dashboard.today_day}: ${format_money(Math.abs(difference))} ${difference > 0 ? "a mais" : "a menos"} que em ${previous_label}`;

  const data = [
    {
      id: previous_label,
      color: scheme.chart_muted,
      data: dashboard.daily_pace.map((point) => ({ x: point.day, y: Number(point.previous) })),
    },
    {
      id: current_label,
      color: scheme.chart_expense,
      data: dashboard.daily_pace
        .filter((point) => point.current !== null)
        .map((point) => ({ x: point.day, y: Number(point.current) })),
    },
  ];

  const chart = (
    <ChartPlotArea $height={240} role="img" aria-label={`Gasto acumulado por dia em ${current_label} e ${previous_label}`}>
      <ResponsiveLine
        data={data}
        theme={nivo_theme}
        colors={(serie) => String(serie.color)}
        margin={{ top: 12, right: 12, bottom: 28, left: 72 }}
        xScale={{ type: "linear", min: 1, max: dashboard.daily_pace.length }}
        yScale={{ type: "linear", min: 0, max: "auto" }}
        curve="monotoneX"
        lineWidth={2}
        enablePoints={false}
        enableArea
        areaOpacity={0.08}
        enableGridX={false}
        gridYValues={4}
        axisLeft={{ tickValues: 4, format: (value) => format_compact_money(Number(value)), tickPadding: 8 }}
        axisBottom={{ tickValues: [1, 10, 20, dashboard.daily_pace.length], tickPadding: 8, format: (value) => `dia ${value}` }}
        enableSlices="x"
        sliceTooltip={({ slice }) => (
          <ChartTooltip
            title={`Dia ${slice.points[0]?.data.x}`}
            rows={slice.points.map((point) => ({
              key: String(point.seriesId),
              label: String(point.seriesId),
              value: format_money(Number(point.data.y)),
              color: point.seriesColor,
            }))}
          />
        )}
        animate={false}
      />
    </ChartPlotArea>
  );

  const table = (
    <ChartDataTable>
      <thead>
        <tr>
          <th scope="col">Dia</th>
          <th scope="col">{current_label}</th>
          <th scope="col">{previous_label}</th>
        </tr>
      </thead>
      <tbody>
        {dashboard.daily_pace.map((point) => (
          <tr key={point.day}>
            <td>{point.day}</td>
            <td>{point.current === null ? "—" : format_money(point.current)}</td>
            <td>{format_money(point.previous)}</td>
          </tr>
        ))}
      </tbody>
    </ChartDataTable>
  );

  return (
    <ChartCard
      title="Ritmo de gastos"
      subtitle={subtitle}
      legend={
        <ChartLegend
          entries={[
            { key: "current", label: `Gasto acumulado em ${current_label}`, color: scheme.chart_expense },
            { key: "previous", label: `Mesmo período em ${previous_label}`, color: scheme.chart_muted },
          ]}
        />
      }
      chart={chart}
      table={table}
    />
  );
};
