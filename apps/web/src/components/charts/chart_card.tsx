"use client";

import { useState } from "react";
import {
  ChartCardFrame,
  ChartCardHeader,
  ChartCardHeading,
  ChartCardSubtitle,
  ChartCardTitle,
  ChartViewToggle,
} from "./chart_card_styles";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  legend?: React.ReactNode;
  chart: React.ReactNode;
  table: React.ReactNode;
};

export const ChartCard = ({ title, subtitle, legend, chart, table }: ChartCardProps) => {
  const [is_table_view, set_is_table_view] = useState(false);

  return (
    <ChartCardFrame>
      <ChartCardHeader>
        <ChartCardHeading>
          <ChartCardTitle>{title}</ChartCardTitle>
          {subtitle ? <ChartCardSubtitle>{subtitle}</ChartCardSubtitle> : null}
        </ChartCardHeading>
        <ChartViewToggle
          type="button"
          aria-pressed={is_table_view}
          onClick={() => set_is_table_view((current_value) => !current_value)}
        >
          {is_table_view ? "Ver gráfico" : "Ver tabela"}
        </ChartViewToggle>
      </ChartCardHeader>
      {is_table_view ? null : legend}
      {is_table_view ? table : chart}
    </ChartCardFrame>
  );
};
