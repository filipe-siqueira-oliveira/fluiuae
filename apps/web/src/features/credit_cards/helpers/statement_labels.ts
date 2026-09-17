import dayjs from "dayjs";

const as_local_day = (iso_date: string) => dayjs(iso_date).add(12, "hour");

export const format_statement_title = (due_date: string): string =>
  `Fatura de ${as_local_day(due_date).format("MMMM [de] YYYY")}`;

export const format_statement_day = (iso_date: string): string =>
  as_local_day(iso_date).format("DD/MM");


export const format_statement_short_month = (due_date: string): string =>
  as_local_day(due_date).format("MMM/YY").replace(".", "");
