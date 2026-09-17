import dayjs from "dayjs";
import { TransactionType } from "@fluiuae/database/enums";
import type { TransactionDto } from "@/types/api";

export type TransactionDayGroup = {
  day_key: string;
  iso_date: string;
  net_total: number;
  transactions: TransactionDto[];
};

const signed_value = (transaction: TransactionDto): number => {
  if (transaction.type === TransactionType.TRANSFER) {
    return 0;
  }

  return transaction.type === TransactionType.INCOME ? Number(transaction.amount) : -Number(transaction.amount);
};

export const group_transactions_by_day = (transactions: TransactionDto[]): TransactionDayGroup[] => {
  const groups = new Map<string, TransactionDayGroup>();

  for (const transaction of transactions) {
    const day_key = dayjs(transaction.issued_at).format("YYYY-MM-DD");
    const group = groups.get(day_key) ?? { day_key, iso_date: transaction.issued_at, net_total: 0, transactions: [] };

    group.net_total += signed_value(transaction);
    group.transactions.push(transaction);
    groups.set(day_key, group);
  }

  return [...groups.values()].sort((first, second) => second.day_key.localeCompare(first.day_key));
};
