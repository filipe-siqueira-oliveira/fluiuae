"use client";

import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { format_money } from "@/lib/money_formatter";
import { FlowExpense, FlowIncome, FlowLegend, FlowTrack } from "./account_card_styles";

type AccountFlowBarProps = {
  month_income: string;
  month_expense: string;
};

export const AccountFlowBar = ({ month_income, month_expense }: AccountFlowBarProps) => {
  const income = Number(month_income);
  const expense = Number(month_expense);
  const total = income + expense;

  return (
    <div>
      <FlowTrack aria-hidden="true">
        {income > 0 ? <FlowIncome $share={income / total} /> : null}
        {expense > 0 ? <FlowExpense $share={expense / total} /> : null}
      </FlowTrack>
      <FlowLegend>
        <span>
          <ArrowDownLeft size={14} aria-hidden="true" />
          <strong>{format_money(income)}</strong> em receitas
        </span>
        <span>
          <ArrowUpRight size={14} aria-hidden="true" />
          <strong>{format_money(expense)}</strong> em despesas
        </span>
      </FlowLegend>
    </div>
  );
};
