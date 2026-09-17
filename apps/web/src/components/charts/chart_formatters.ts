import dayjs from "dayjs";

const compact_currency_formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const format_compact_money = (value: number): string =>
  compact_currency_formatter.format(value);

export const format_short_month = (month_start: string): string =>
  dayjs(month_start).add(12, "hour").format("MMM");

export const format_long_month = (month_start: string): string =>
  dayjs(month_start).add(12, "hour").format("MMMM [de] YYYY");
