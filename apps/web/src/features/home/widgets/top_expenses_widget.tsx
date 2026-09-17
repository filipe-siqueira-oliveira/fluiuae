"use client";

import dayjs from "dayjs";
import { format_money } from "@/lib/money_formatter";
import { WidgetCard } from "../components/widget_card";
import {
  Dot,
  ItemAmount,
  ItemIdentity,
  ItemList,
  ItemMeta,
  ItemRow,
  ItemText,
  ItemTitle,
  WidgetEmpty,
} from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const TopExpensesWidget = ({ dashboard }: { dashboard: DashboardDto }) => (
  <WidgetCard title="Maiores despesas" subtitle={`As mais altas de ${dayjs(dashboard.month_start).format("MMMM")}`}>
    {dashboard.top_expenses.length === 0 ? (
      <WidgetEmpty>Nenhuma despesa neste mês ainda.</WidgetEmpty>
    ) : (
      <ItemList>
        {dashboard.top_expenses.map((expense) => (
          <ItemRow key={expense.id}>
            <ItemIdentity>
              <Dot $color={expense.category_color ?? "#9AA8A0"} aria-hidden="true" />
              <ItemText>
                <ItemTitle title={expense.description}>{expense.description}</ItemTitle>
                <ItemMeta>
                  {expense.category_name ?? "Sem categoria"}, {dayjs(expense.issued_at).format("DD/MM")}
                </ItemMeta>
              </ItemText>
            </ItemIdentity>
            <ItemAmount>{format_money(expense.amount)}</ItemAmount>
          </ItemRow>
        ))}
      </ItemList>
    )}
  </WidgetCard>
);
