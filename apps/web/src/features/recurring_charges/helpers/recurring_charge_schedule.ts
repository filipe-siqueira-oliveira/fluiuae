import dayjs from "dayjs";
import type { RecurringChargeDto } from "@/types/api";

export type RecurringChargePhase = "active" | "upcoming" | "finished";

const month_key = (iso_date: string): string => iso_date.slice(0, 7);

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const format_charge_month = (iso_date: string): string =>
  dayjs(iso_date).add(12, "hour").format("MMM/YY").replace(".", "");

export const format_charge_month_long = (iso_date: string): string =>
  capitalize(dayjs(iso_date).add(12, "hour").format("MMM [de] YYYY").replace(".", ""));

export const resolve_charge_phase = (
  recurring_charge: RecurringChargeDto,
  current_month = dayjs().format("YYYY-MM")
): RecurringChargePhase => {
  if (month_key(recurring_charge.starts_at_month) > current_month) {
    return "upcoming";
  }

  return month_key(recurring_charge.ends_at_month) < current_month ? "finished" : "active";
};

export const remaining_installments = (recurring_charge: RecurringChargeDto): number =>
  recurring_charge.installment_count - recurring_charge.generated_count;

const by_end_month = (first: RecurringChargeDto, second: RecurringChargeDto): number =>
  first.ends_at_month.localeCompare(second.ends_at_month) || first.description.localeCompare(second.description, "pt-BR");

export const split_recurring_charges = (recurring_charges: RecurringChargeDto[]) => {
  const ongoing = recurring_charges.filter((charge) => resolve_charge_phase(charge) !== "finished").sort(by_end_month);
  const finished = recurring_charges
    .filter((charge) => resolve_charge_phase(charge) === "finished")
    .sort((first, second) => by_end_month(second, first));

  return { ongoing, finished };
};

export const summarize_recurring_charges = (recurring_charges: RecurringChargeDto[]) => {
  const active = recurring_charges.filter((charge) => resolve_charge_phase(charge) === "active");
  const not_finished = recurring_charges.filter((charge) => resolve_charge_phase(charge) !== "finished");

  return {
    month_total: active.reduce((total, charge) => total + Number(charge.installment_amount), 0),
    active_count: active.length,
    remaining_total: not_finished.reduce((total, charge) => total + Number(charge.remaining_amount), 0),
    remaining_installments: not_finished.reduce((total, charge) => total + remaining_installments(charge), 0),
    ending_first: [...active].sort(by_end_month)[0] ?? null,
  };
};
