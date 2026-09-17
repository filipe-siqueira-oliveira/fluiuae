import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export const format_date = (value: string | Date | null | undefined): string =>
  value ? dayjs(value).format("DD/MM/YYYY") : "-";

export const format_month = (value: string | Date | null | undefined): string =>
  value ? dayjs(value).add(12, "hour").format("MMM/YYYY") : "-";

export const to_iso_date = (value: string | Date): string => dayjs(value).toISOString();

export const start_of_current_month = (): string => dayjs().startOf("month").toISOString();

export const end_of_current_month = (): string => dayjs().endOf("month").toISOString();
