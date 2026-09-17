"use client";

import { ChartCard } from "./chart_card";
import { ChartDataTable } from "./chart_card_styles";
import { format_money } from "@/lib/money_formatter";
import {
  CategoryBarDot,
  CategoryBarFill,
  CategoryBarItem,
  CategoryBarList,
  CategoryBarName,
  CategoryBarTrack,
  CategoryBarValue,
  CategoryEmptyText,
} from "./category_spending_chart_styles";

export type CategorySpendingItem = {
  key: string;
  name: string;
  color: string;
  amount: string;
};

type CategorySpendingChartProps = {
  title: string;
  subtitle: string;
  empty_message: string;
  categories: CategorySpendingItem[];
  total: string;
};

export const CategorySpendingChart = ({
  title,
  subtitle,
  empty_message,
  categories,
  total,
}: CategorySpendingChartProps) => {
  const largest_amount = Math.max(...categories.map((category) => Number(category.amount)), 0);

  const chart =
    categories.length === 0 ? (
      <CategoryEmptyText>{empty_message}</CategoryEmptyText>
    ) : (
      <CategoryBarList aria-label={title}>
        {categories.map((category) => (
          <CategoryBarItem key={category.key}>
            <CategoryBarName title={category.name}>
              <CategoryBarDot $color={category.color} aria-hidden="true" />
              <span>{category.name}</span>
            </CategoryBarName>
            <CategoryBarTrack>
              <CategoryBarFill $share={largest_amount > 0 ? Number(category.amount) / largest_amount : 0} />
              <CategoryBarValue>{format_money(category.amount)}</CategoryBarValue>
            </CategoryBarTrack>
          </CategoryBarItem>
        ))}
      </CategoryBarList>
    );

  const table = (
    <ChartDataTable>
      <thead>
        <tr>
          <th scope="col">Categoria</th>
          <th scope="col">Valor</th>
          <th scope="col">Parte do total</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.key}>
            <td>{category.name}</td>
            <td>{format_money(category.amount)}</td>
            <td>
              {Number(total) > 0 ? `${Math.round((Number(category.amount) / Number(total)) * 100)}%` : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </ChartDataTable>
  );

  return <ChartCard title={title} subtitle={subtitle} chart={chart} table={table} />;
};
