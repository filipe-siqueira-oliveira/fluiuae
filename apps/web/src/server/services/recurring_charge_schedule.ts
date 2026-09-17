import type { RecurringCharge } from "@fluiuae/database";
import {
  add_months,
  count_months_between,
  current_month_start,
  earliest_month,
  to_month_start,
} from "@/lib/month_calendar";

type ScheduleSource = Pick<RecurringCharge, "starts_at_month" | "installment_count" | "last_generated_month">;

export const resolve_last_installment_month = (source: ScheduleSource): Date =>
  add_months(to_month_start(source.starts_at_month), source.installment_count - 1);

export const count_generated_installments = (source: ScheduleSource): number => {
  if (!source.last_generated_month) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      count_months_between(
        to_month_start(source.starts_at_month),
        earliest_month(to_month_start(source.last_generated_month), current_month_start())
      ),
      source.installment_count
    )
  );
};

export const resolve_installment_number = (starts_at_month: Date, month_start: Date): number =>
  count_months_between(to_month_start(starts_at_month), month_start);
