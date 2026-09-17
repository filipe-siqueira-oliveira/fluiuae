import dayjs from "dayjs";
import type { FixedTransactionDto } from "@/types/api";

export type FixedTransactionTiming = {
  effective_day: number;
  has_passed: boolean;
  days_until: number;
};

export const resolve_fixed_transaction_timing = (
  fixed_transaction: FixedTransactionDto,
  today = dayjs()
): FixedTransactionTiming => {
  const effective_day = Math.min(fixed_transaction.day_of_month, today.daysInMonth());
  const days_until = effective_day - today.date();

  return { effective_day, has_passed: days_until < 0, days_until };
};

export const sort_by_day = (fixed_transactions: FixedTransactionDto[]): FixedTransactionDto[] =>
  [...fixed_transactions].sort(
    (first, second) =>
      first.day_of_month - second.day_of_month || first.description.localeCompare(second.description, "pt-BR")
  );

export const describe_timing = (timing: FixedTransactionTiming): string => {
  if (timing.has_passed) {
    return "Já passou";
  }

  if (timing.days_until === 0) {
    return "Hoje";
  }

  if (timing.days_until === 1) {
    return "Amanhã";
  }

  return `Em ${timing.days_until} dias`;
};

export const summarize_fixed_transactions = (fixed_transactions: FixedTransactionDto[]) => {
  const with_timing = sort_by_day(fixed_transactions).map((fixed_transaction) => ({
    fixed_transaction,
    timing: resolve_fixed_transaction_timing(fixed_transaction),
  }));
  const sum = (items: typeof with_timing) =>
    items.reduce((total, item) => total + Number(item.fixed_transaction.amount), 0);
  const passed = with_timing.filter((item) => item.timing.has_passed);
  const upcoming = with_timing.filter((item) => !item.timing.has_passed);

  return {
    monthly_total: sum(with_timing),
    passed_total: sum(passed),
    passed_count: passed.length,
    upcoming_total: sum(upcoming),
    next_item: upcoming[0] ?? null,
  };
};
