import dayjs, { type Dayjs } from "dayjs";

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const current_month = (): Dayjs => dayjs().startOf("month");

export const month_range = (month: Dayjs) => ({
  start_date: month.startOf("month").toISOString(),
  end_date: month.endOf("month").toISOString(),
});

export const format_month_title = (month: Dayjs): string => capitalize(month.format("MMMM [de] YYYY"));

export const format_month_name = (month: Dayjs): string => month.format("MMMM");

export const is_current_month = (month: Dayjs): boolean => month.isSame(dayjs(), "month");

export const format_day_heading = (iso_date: string): string => {
  const day = dayjs(iso_date);

  if (day.isSame(dayjs(), "day")) {
    return `Hoje, ${day.format("DD/MM")}`;
  }

  if (day.isSame(dayjs().subtract(1, "day"), "day")) {
    return `Ontem, ${day.format("DD/MM")}`;
  }

  return capitalize(day.format("dddd, DD/MM"));
};
