"use client";

import { CalendarRange, HandCoins, Hourglass, Layers } from "lucide-react";
import { TransactionType } from "@fluiuae/database/enums";
import { SummaryRail } from "@/components/data/summary_rail";
import { format_money } from "@/lib/money_formatter";
import { format_charge_month_long, summarize_recurring_charges } from "../helpers/recurring_charge_schedule";
import type { RecurringChargeDto } from "@/types/api";

type RecurringChargesSummaryRailProps = {
  recurring_charges: RecurringChargeDto[];
};

const plural = (count: number, singular: string, many: string): string => (count === 1 ? `1 ${singular}` : `${count} ${many}`);

export const RecurringChargesSummaryRail = ({ recurring_charges }: RecurringChargesSummaryRailProps) => {
  const summary = summarize_recurring_charges(
    recurring_charges.filter((charge) => charge.type !== TransactionType.INCOME)
  );
  const receivable_summary = summarize_recurring_charges(
    recurring_charges.filter((charge) => charge.type === TransactionType.INCOME)
  );
  const icon_size = 15;
  const receivable_items =
    receivable_summary.remaining_installments > 0
      ? [
          {
            key: "receivable",
            label: "Ainda a receber",
            icon: <HandCoins size={icon_size} strokeWidth={1.75} />,
            value: format_money(receivable_summary.remaining_total),
            hint: `Em ${plural(receivable_summary.remaining_installments, "parcela", "parcelas")} dos próximos meses`,
          },
        ]
      : [];

  return (
    <SummaryRail
      items={[
        {
          key: "month",
          label: "Parcelas deste mês",
          icon: <Layers size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.month_total),
          hint: `Somando ${plural(summary.active_count, "recorrência ativa", "recorrências ativas")}`,
        },
        {
          key: "remaining",
          label: "Ainda falta",
          icon: <Hourglass size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.remaining_total),
          hint: `Em ${plural(summary.remaining_installments, "parcela", "parcelas")} dos próximos meses`,
        },
        {
          key: "ending",
          label: "Termina primeiro",
          icon: <CalendarRange size={icon_size} strokeWidth={1.75} />,
          value: summary.ending_first ? format_charge_month_long(summary.ending_first.ends_at_month) : "—",
          hint: summary.ending_first ? summary.ending_first.description : "Nenhuma recorrência ativa",
        },
        ...receivable_items,
      ]}
    />
  );
};
