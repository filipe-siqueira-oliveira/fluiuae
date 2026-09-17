"use client";

import dayjs from "dayjs";
import { ResponsiveBar } from "@nivo/bar";
import { ChartCard } from "@/components/charts/chart_card";
import { ChartDataTable, ChartPlotArea } from "@/components/charts/chart_card_styles";
import { format_compact_money } from "@/components/charts/chart_formatters";
import { ChartLegend } from "@/components/charts/chart_legend";
import { ChartTooltip } from "@/components/charts/chart_tooltip";
import { use_chart_palette } from "@/components/charts/use_chart_palette";
import { format_money } from "@/lib/money_formatter";
import type { DashboardDto } from "@/types/api";

export const CashFlowWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const { scheme, nivo_theme } = use_chart_palette();
  const rows = dashboard.cash_flow.map((month) => ({
    month: dayjs(month.month_start).add(12, "hour").format("MMM"),
    month_label: dayjs(month.month_start).add(12, "hour").format("MMMM [de] YYYY"),
    Receitas: Number(month.income),
    Despesas: -Number(month.expense),
  }));
  const extreme = Math.max(1, ...rows.map((row) => Math.max(row.Receitas, -row.Despesas)));
  const net_total = rows.reduce((sum, row) => sum + row.Receitas + row.Despesas, 0);

  const chart = (
    <ChartPlotArea $height={240} role="img" aria-label="Receitas e despesas dos últimos 6 meses">
      <ResponsiveBar
        data={rows}
        keys={["Receitas", "Despesas"]}
        indexBy="month"
        theme={nivo_theme}
        colors={({ id }) => (id === "Receitas" ? scheme.chart_income : scheme.chart_expense)}
        margin={{ top: 12, right: 12, bottom: 28, left: 72 }}
        padding={0.72}
        innerPadding={2}
        borderRadius={4}
        valueScale={{ type: "linear", min: -extreme * 1.05, max: extreme * 1.05 }}
        enableLabel={false}
        enableGridY
        gridYValues={5}
        axisLeft={{ tickValues: 5, format: (value) => format_compact_money(Math.abs(Number(value))), tickPadding: 8 }}
        axisBottom={{ tickPadding: 8 }}
        markers={[{ axis: "y", value: 0, lineStyle: { stroke: scheme.border_strong, strokeWidth: 1 } }]}
        tooltip={({ data }) => (
          <ChartTooltip
            title={String(data.month_label)}
            rows={[
              { key: "income", label: "receitas", value: format_money(Number(data.Receitas)), color: scheme.chart_income },
              { key: "expense", label: "despesas", value: format_money(Math.abs(Number(data.Despesas))), color: scheme.chart_expense },
            ]}
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
          <th scope="col">Mês</th>
          <th scope="col">Receitas</th>
          <th scope="col">Despesas</th>
          <th scope="col">Resultado</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.month_label}>
            <td>{row.month_label}</td>
            <td>{format_money(row.Receitas)}</td>
            <td>{format_money(-row.Despesas)}</td>
            <td>{format_money(row.Receitas + row.Despesas)}</td>
          </tr>
        ))}
      </tbody>
    </ChartDataTable>
  );

  return (
    <ChartCard
      title="Receitas e despesas"
      subtitle={`Últimos 6 meses, ${net_total >= 0 ? "sobrou" : "faltou"} ${format_money(Math.abs(net_total))} no total`}
      legend={
        <ChartLegend
          entries={[
            { key: "income", label: "Receitas, acima da linha", color: scheme.chart_income },
            { key: "expense", label: "Despesas, abaixo da linha", color: scheme.chart_expense },
          ]}
        />
      }
      chart={chart}
      table={table}
    />
  );
};
