"use client";

import { CalendarCheck, CalendarClock, Repeat } from "lucide-react";
import { SummaryRail } from "@/components/data/summary_rail";
import { format_money } from "@/lib/money_formatter";
import { summarize_fixed_transactions } from "../helpers/fixed_transaction_schedule";
import type { read_fixed_transaction_copy } from "../helpers/fixed_transaction_copy";
import type { FixedTransactionDto } from "@/types/api";

type FixedTransactionsSummaryRailProps = {
  fixed_transactions: FixedTransactionDto[];
  copy: ReturnType<typeof read_fixed_transaction_copy>;
};

const describe_count = (count: number, singular: string, plural: string): string =>
  count === 1 ? `1 ${singular}` : `${count} ${plural}`;

export const FixedTransactionsSummaryRail = ({ fixed_transactions, copy }: FixedTransactionsSummaryRailProps) => {
  const summary = summarize_fixed_transactions(fixed_transactions);
  const icon_size = 15;
  const next_hint = summary.next_item
    ? `Próxima: ${summary.next_item.fixed_transaction.description}, dia ${summary.next_item.timing.effective_day}`
    : "Nada mais neste mês";

  return (
    <SummaryRail
      items={[
        {
          key: "monthly_total",
          label: "Total por mês",
          icon: <Repeat size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.monthly_total),
          hint: describe_count(fixed_transactions.length, copy.singular, copy.plural),
        },
        {
          key: "launched",
          label: copy.launched_label,
          icon: <CalendarCheck size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.passed_total),
          hint: `${summary.passed_count} de ${fixed_transactions.length} com o dia já passado`,
        },
        {
          key: "pending",
          label: copy.pending_label,
          icon: <CalendarClock size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.upcoming_total),
          hint: next_hint,
        },
      ]}
    />
  );
};
