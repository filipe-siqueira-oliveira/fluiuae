import {
  add_months,
  build_date_in_month,
  next_month_start,
  to_month_start,
} from "./month_calendar";

const to_utc_day = (date: Date): Date =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12));

export const today_as_utc_day = (reference_date: Date): Date =>
  new Date(Date.UTC(reference_date.getFullYear(), reference_date.getMonth(), reference_date.getDate(), 12));

const statement_month_for_day = (day: Date, closing_day: number): Date => {
  const month_start = to_month_start(day);
  const closing_date = build_date_in_month(month_start, closing_day);

  return day.getTime() <= closing_date.getTime() ? month_start : next_month_start(month_start);
};

export const resolve_statement_month = (purchase_date: Date, closing_day: number): Date =>
  statement_month_for_day(to_utc_day(purchase_date), closing_day);

export const resolve_open_statement_month = (closing_day: number, reference_date = new Date()): Date =>
  statement_month_for_day(today_as_utc_day(reference_date), closing_day);

export const resolve_statement_closing_date = (statement_month: Date, closing_day: number): Date =>
  build_date_in_month(statement_month, closing_day);

export const resolve_statement_due_date = (
  statement_month: Date,
  closing_day: number,
  due_day: number
): Date =>
  build_date_in_month(due_day > closing_day ? statement_month : add_months(statement_month, 1), due_day);

export type StatementPhase = "OPEN" | "CLOSED" | "UPCOMING";

export type StatementStatus = "PAID" | "OVERDUE" | "PENDING";

export const resolve_statement_phase = (statement_month: Date, open_month: Date): StatementPhase => {
  if (statement_month.getTime() === open_month.getTime()) {
    return "OPEN";
  }

  return statement_month.getTime() < open_month.getTime() ? "CLOSED" : "UPCOMING";
};

export const resolve_statement_status = (input: {
  is_paid: boolean;
  due_date: Date;
  reference_date?: Date;
}): StatementStatus => {
  if (input.is_paid) {
    return "PAID";
  }

  return input.due_date.getTime() < today_as_utc_day(input.reference_date ?? new Date()).getTime()
    ? "OVERDUE"
    : "PENDING";
};

export const to_statement_key = (statement_month: Date): string =>
  `${statement_month.getUTCFullYear()}-${String(statement_month.getUTCMonth() + 1).padStart(2, "0")}`;
