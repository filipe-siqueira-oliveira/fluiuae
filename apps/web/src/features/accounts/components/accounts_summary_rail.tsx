"use client";

import dayjs from "dayjs";
import { ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";
import { SummaryRail } from "@/components/data/summary_rail";
import { format_money } from "@/lib/money_formatter";
import type { AccountsSummaryDto } from "@/types/api";

type AccountsSummaryRailProps = {
  summary: AccountsSummaryDto;
  account_count: number;
};

const describe_account_count = (account_count: number): string =>
  account_count === 1 ? "Somando 1 conta" : `Somando ${account_count} contas`;

export const AccountsSummaryRail = ({ summary, account_count }: AccountsSummaryRailProps) => {
  const month_label = dayjs(summary.month_start).add(12, "hour").format("MMMM");
  const icon_size = 15;

  return (
    <SummaryRail
      items={[
        {
          key: "balance",
          label: "Saldo somado",
          icon: <Wallet size={icon_size} strokeWidth={1.75} />,
          value: format_money(summary.total_balance),
          hint: describe_account_count(account_count),
          tone: Number(summary.total_balance) < 0 ? "negative" : "neutral",
        },
        {
          key: "income",
          label: "Receitas do mês",
          icon: <ArrowDownLeft size={icon_size} strokeWidth={2} />,
          value: format_money(summary.month_income),
          hint: `Efetivadas em ${month_label}`,
        },
        {
          key: "expense",
          label: "Despesas do mês",
          icon: <ArrowUpRight size={icon_size} strokeWidth={2} />,
          value: format_money(summary.month_expense),
          hint: `Efetivadas em ${month_label}`,
        },
      ]}
    />
  );
};
