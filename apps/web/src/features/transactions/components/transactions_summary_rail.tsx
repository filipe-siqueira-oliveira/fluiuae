"use client";

import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { SummaryRail } from "@/components/data/summary_rail";
import { format_money } from "@/lib/money_formatter";
import type { TransactionSummaryDto } from "@/types/api";

type TransactionsSummaryRailProps = {
  summary: TransactionSummaryDto;
  month_name: string;
};

const describe_pending = (pending: number, verb: string): string =>
  pending > 0 ? `+ ${format_money(pending)} ainda ${verb}` : "Nada previsto a mais";

export const TransactionsSummaryRail = ({ summary, month_name }: TransactionsSummaryRailProps) => {
  const income_paid = Number(summary.total_income_paid);
  const income_pending = Number(summary.total_income_pending);
  const expense_paid = Number(summary.total_expense_paid);
  const expense_pending = Number(summary.total_expense_pending);
  const result = income_paid - expense_paid;
  const projected = income_paid + income_pending - expense_paid - expense_pending;
  const icon_size = 15;

  return (
    <SummaryRail
      items={[
        {
          key: "income",
          label: `Receitas de ${month_name}`,
          icon: <ArrowDownLeft size={icon_size} strokeWidth={2} />,
          value: format_money(income_paid),
          hint: describe_pending(income_pending, "a receber"),
        },
        {
          key: "expense",
          label: `Despesas de ${month_name}`,
          icon: <ArrowUpRight size={icon_size} strokeWidth={2} />,
          value: format_money(expense_paid),
          hint: describe_pending(expense_pending, "a pagar"),
        },
        {
          key: "result",
          label: "Resultado do mês",
          icon: <Scale size={icon_size} strokeWidth={1.75} />,
          value: format_money(result),
          tone: result < 0 ? "negative" : result > 0 ? "positive" : "neutral",
          hint: `Contando os previstos: ${format_money(projected)}`,
        },
      ]}
    />
  );
};
