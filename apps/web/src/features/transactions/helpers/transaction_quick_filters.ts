import { TransactionStatus, TransactionType } from "@fluiuae/database/enums";
import type { TransactionViewFilters } from "../hooks/use_transactions_list";

export type QuickFilterKey = "all" | "paid" | "to_pay" | "received" | "to_receive";

type QuickFilter = {
  key: QuickFilterKey;
  label: string;
  type?: TransactionType;
  status?: TransactionStatus;
};

export const quick_filters: QuickFilter[] = [
  { key: "all", label: "Todos" },
  { key: "paid", label: "Pago", type: TransactionType.EXPENSE, status: TransactionStatus.PAID },
  { key: "to_pay", label: "A pagar", type: TransactionType.EXPENSE, status: TransactionStatus.PENDING },
  { key: "received", label: "Recebido", type: TransactionType.INCOME, status: TransactionStatus.PAID },
  { key: "to_receive", label: "A receber", type: TransactionType.INCOME, status: TransactionStatus.PENDING },
];

export const resolve_quick_filter_key = (filters: TransactionViewFilters): QuickFilterKey =>
  quick_filters.find((filter) => filter.type === filters.type && filter.status === filters.status)?.key ?? "all";
