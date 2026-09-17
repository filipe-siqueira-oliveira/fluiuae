const build_utc_date = (year: number, month_index: number, day: number, hour = 0): Date =>
  new Date(Date.UTC(year, month_index, day, hour));

const days_in_month = (year: number, month_index: number): number =>
  new Date(Date.UTC(year, month_index + 1, 0)).getUTCDate();

export const to_month_start = (date: Date): Date =>
  build_utc_date(date.getUTCFullYear(), date.getUTCMonth(), 1);

export const current_month_start = (): Date => {
  const now = new Date();

  return build_utc_date(now.getFullYear(), now.getMonth(), 1);
};

export const next_month_start = (month_start: Date): Date =>
  build_utc_date(month_start.getUTCFullYear(), month_start.getUTCMonth() + 1, 1);

export const list_months_between = (first_month: Date, last_month: Date): Date[] => {
  const months: Date[] = [];
  let cursor = to_month_start(first_month);

  while (cursor.getTime() <= last_month.getTime()) {
    months.push(cursor);
    cursor = next_month_start(cursor);
  }

  return months;
};

export const build_date_in_month = (month_start: Date, day_of_month: number): Date => {
  const year = month_start.getUTCFullYear();
  const month_index = month_start.getUTCMonth();
  const safe_day = Math.min(day_of_month, days_in_month(year, month_index));

  return build_utc_date(year, month_index, safe_day, 12);
};

export const add_months = (month_start: Date, month_count: number): Date =>
  build_utc_date(month_start.getUTCFullYear(), month_start.getUTCMonth() + month_count, 1);

export const count_months_between = (first_month: Date, last_month: Date): number =>
  (last_month.getUTCFullYear() - first_month.getUTCFullYear()) * 12 +
  (last_month.getUTCMonth() - first_month.getUTCMonth()) +
  1;

export const parse_month_string = (month_string: string): Date => {
  const [year, month] = month_string.split("-").map(Number);

  return build_utc_date(year, month - 1, 1);
};

export const earliest_month = (first_month: Date, second_month: Date): Date =>
  first_month.getTime() <= second_month.getTime() ? first_month : second_month;

export const next_occurrence_of_day = (day_of_month: number, reference_date = new Date()): Date => {
  const today = build_utc_date(
    reference_date.getFullYear(),
    reference_date.getMonth(),
    reference_date.getDate(),
    12
  );
  const this_month = build_date_in_month(to_month_start(today), day_of_month);

  if (this_month.getTime() >= today.getTime()) {
    return this_month;
  }

  return build_date_in_month(next_month_start(to_month_start(today)), day_of_month);
};
