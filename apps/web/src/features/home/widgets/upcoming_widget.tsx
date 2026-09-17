"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { StatusPill } from "@/components/data/status_pill";
import { format_money } from "@/lib/money_formatter";
import { WidgetCard } from "../components/widget_card";
import {
  ItemAmount,
  ItemList,
  ItemMeta,
  ItemRow,
  ItemText,
  ItemTitle,
  WidgetEmpty,
} from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

const describe_due = (due_date: string, is_overdue: boolean): string => {
  const days = dayjs(due_date).startOf("day").diff(dayjs().startOf("day"), "day");

  if (is_overdue) {
    return `Venceu ${dayjs(due_date).format("DD/MM")}`;
  }

  if (days <= 0) {
    return "Vence hoje";
  }

  return days === 1 ? "Vence amanhã" : `Vence ${dayjs(due_date).format("DD/MM")}, em ${days} dias`;
};

export const UpcomingWidget = ({ dashboard }: { dashboard: DashboardDto }) => (
  <WidgetCard title="Próximos pagamentos" subtitle="Atrasados e os que vencem em 15 dias">
    {dashboard.upcoming.length === 0 ? (
      <WidgetEmpty>Nada para pagar ou receber nos próximos 15 dias.</WidgetEmpty>
    ) : (
      <ItemList>
        {dashboard.upcoming.map((item) => (
          <ItemRow key={item.key}>
            <ItemText>
              <ItemTitle title={item.description}>
                <Link href={item.href} style={{ color: "inherit" }}>
                  {item.description}
                </Link>
              </ItemTitle>
              <ItemMeta>
                {item.detail}, {describe_due(item.due_date, item.is_overdue).toLowerCase()}
              </ItemMeta>
            </ItemText>
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
              <ItemAmount $tone={item.is_income ? "income" : "neutral"}>
                {item.is_income ? "+ " : ""}
                {format_money(item.amount)}
              </ItemAmount>
              {item.is_overdue ? <StatusPill tone="danger">Atrasado</StatusPill> : null}
            </span>
          </ItemRow>
        ))}
      </ItemList>
    )}
  </WidgetCard>
);
