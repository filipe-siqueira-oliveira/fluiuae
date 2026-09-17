import { add_months, current_month_start, to_month_start } from "@/lib/month_calendar";

const max_months_ahead = 60;

export const resolve_generation_month = (requested_date?: Date | null): Date => {
  const current_month = current_month_start();

  if (!requested_date || Number.isNaN(requested_date.getTime())) {
    return current_month;
  }

  const requested_month = to_month_start(requested_date);
  const limit_month = add_months(current_month, max_months_ahead);

  if (requested_month.getTime() < current_month.getTime()) {
    return current_month;
  }

  return requested_month.getTime() > limit_month.getTime() ? limit_month : requested_month;
};
