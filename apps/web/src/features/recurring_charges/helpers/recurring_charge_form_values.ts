import dayjs, { type Dayjs } from "dayjs";
import type {
  CreateRecurringChargePayload,
  RecurringChargePayload,
} from "../api/recurring_charges_api";
import {
  decode_payment_source,
  payment_source_from_reference,
} from "@/features/payment_sources/helpers/payment_source_value";
import type { RecurringChargeDto } from "@/types/api";

export type RecurringChargeFormValues = {
  description: string;
  installment_amount: number;
  installment_count: number;
  starts_at_month: Dayjs;
  day_of_month: number;
  payment_source?: string;
  category_id?: string | null;
  is_automatic_debit: boolean;
};

export const build_recurring_charge_form_values = (
  recurring_charge: RecurringChargeDto | null,
  default_payment_source: string | undefined,
  default_category_id: string | null
): RecurringChargeFormValues => ({
  description: recurring_charge?.description ?? "",
  installment_amount: Number(recurring_charge?.installment_amount ?? 0),
  installment_count: recurring_charge?.installment_count ?? 2,
  starts_at_month: recurring_charge
    ? dayjs(recurring_charge.starts_at_month).add(12, "hour")
    : dayjs().startOf("month"),
  day_of_month: recurring_charge?.day_of_month ?? dayjs().date(),
  payment_source: recurring_charge
    ? payment_source_from_reference(recurring_charge)
    : default_payment_source,
  category_id: recurring_charge ? recurring_charge.category?.id ?? null : default_category_id,
  is_automatic_debit: recurring_charge?.is_automatic_debit ?? false,
});

export const to_recurring_charge_payload = (
  values: RecurringChargeFormValues
): RecurringChargePayload => ({
  description: values.description,
  installment_amount: values.installment_amount,
  installment_count: values.installment_count,
  day_of_month: values.day_of_month,
  ...decode_payment_source(values.payment_source),
  category_id: values.category_id ?? null,
  is_automatic_debit: Boolean(values.is_automatic_debit),
});

export const to_create_recurring_charge_payload = (
  values: RecurringChargeFormValues
): CreateRecurringChargePayload => ({
  ...to_recurring_charge_payload(values),
  starts_at_month: values.starts_at_month.format("YYYY-MM"),
});
