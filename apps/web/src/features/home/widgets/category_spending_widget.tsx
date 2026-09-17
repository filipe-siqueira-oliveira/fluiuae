"use client";

import dayjs from "dayjs";
import { CategorySpendingChart } from "@/components/charts/category_spending_chart";
import type { DashboardDto } from "@/types/api";

const visible_count = 6;

const fold_small_categories = (categories: DashboardDto["categories"]): DashboardDto["categories"] => {
  if (categories.length <= visible_count + 1) {
    return categories;
  }

  const rest = categories.slice(visible_count).reduce((sum, category) => sum + Number(category.amount), 0);

  return [
    ...categories.slice(0, visible_count),
    { key: "others", name: "Outras categorias", color: "#9AA8A0", amount: rest.toFixed(2) },
  ];
};

export const CategorySpendingWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const total = dashboard.categories.reduce((sum, category) => sum + Number(category.amount), 0);
  const month_name = dayjs(dashboard.month_start).format("MMMM");

  return (
    <CategorySpendingChart
      title="Gastos por categoria"
      subtitle={`Despesas de ${month_name}, somando o previsto`}
      empty_message={`Nenhuma despesa em ${month_name} ainda.`}
      categories={fold_small_categories(dashboard.categories)}
      total={total.toFixed(2)}
    />
  );
};
