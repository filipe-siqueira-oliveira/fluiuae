import dayjs from "dayjs";

export const format_next_date = (iso_date: string): string =>
  dayjs(iso_date).format("DD/MM");

export const describe_days_until = (iso_date: string): string => {
  const days = dayjs(iso_date).startOf("day").diff(dayjs().startOf("day"), "day");

  if (days <= 0) {
    return "hoje";
  }

  if (days === 1) {
    return "amanhã";
  }

  return `em ${days} dias`;
};
