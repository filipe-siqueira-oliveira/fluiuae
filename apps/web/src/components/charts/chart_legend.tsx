"use client";

import { ChartLegend as LegendList, ChartLegendItem, ChartLegendSwatch } from "./chart_card_styles";

export type ChartLegendEntry = {
  key: string;
  label: string;
  color: string;
};

type ChartLegendProps = {
  entries: ChartLegendEntry[];
};

export const ChartLegend = ({ entries }: ChartLegendProps) => (
  <LegendList>
    {entries.map((entry) => (
      <ChartLegendItem key={entry.key}>
        <ChartLegendSwatch $color={entry.color} aria-hidden="true" />
        {entry.label}
      </ChartLegendItem>
    ))}
  </LegendList>
);
