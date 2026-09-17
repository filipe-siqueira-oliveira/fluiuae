"use client";

import { format_money } from "@/lib/money_formatter";
import { group_transactions_by_day } from "../helpers/transaction_day_groups";
import { format_day_heading } from "../helpers/transaction_month";
import { TransactionRow } from "./transaction_row";
import { DayGroup, DayHeader, DayTitle, DayTotal, RowList } from "./transaction_row_styles";
import type { TransactionDto } from "@/types/api";

type TransactionDayListProps = {
  transactions: TransactionDto[];
  can_write: boolean;
  on_edit: (transaction: TransactionDto) => void;
  on_settle: (transaction: TransactionDto) => void;
};

const format_day_total = (net_total: number): string =>
  `${net_total > 0 ? "+" : net_total < 0 ? "−" : ""} ${format_money(Math.abs(net_total))}`.trim();

export const TransactionDayList = ({ transactions, can_write, on_edit, on_settle }: TransactionDayListProps) => (
  <>
    {group_transactions_by_day(transactions).map((group, index) => (
      <DayGroup data-tour={index === 0 ? "transactions_list" : undefined} key={group.day_key} aria-labelledby={`transaction_day_${group.day_key}`}>
        <DayHeader>
          <DayTitle id={`transaction_day_${group.day_key}`}>{format_day_heading(group.iso_date)}</DayTitle>
          <DayTotal $is_negative={group.net_total < 0}>{format_day_total(group.net_total)}</DayTotal>
        </DayHeader>
        <RowList>
          {group.transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              can_write={can_write}
              on_edit={on_edit}
              on_settle={on_settle}
            />
          ))}
        </RowList>
      </DayGroup>
    ))}
  </>
);
