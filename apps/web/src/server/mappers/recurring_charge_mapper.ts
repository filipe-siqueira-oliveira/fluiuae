import type { RecurringChargeDto } from "@/types/api";
import type { RecurringChargeWithRelations } from "@/server/services/recurring_charge_query";
import {
  count_generated_installments,
  resolve_last_installment_month,
} from "@/server/services/recurring_charge_schedule";
import { serialize_decimal } from "./decimal_serializer";

export const to_recurring_charge_dto = (
  recurring_charge: RecurringChargeWithRelations
): RecurringChargeDto => {
  const installment_amount = Number(recurring_charge.installment_amount);
  const generated_count = count_generated_installments(recurring_charge);
  const remaining_count = recurring_charge.installment_count - generated_count;

  return {
    id: recurring_charge.id,
    description: recurring_charge.description,
    installment_amount: serialize_decimal(recurring_charge.installment_amount),
    installment_count: recurring_charge.installment_count,
    generated_count,
    total_amount: serialize_decimal(installment_amount * recurring_charge.installment_count),
    remaining_amount: serialize_decimal(installment_amount * remaining_count),
    day_of_month: recurring_charge.day_of_month,
    starts_at_month: recurring_charge.starts_at_month.toISOString(),
    ends_at_month: resolve_last_installment_month(recurring_charge).toISOString(),
    account: recurring_charge.account,
    credit_card: recurring_charge.credit_card,
    category: recurring_charge.category,
    is_automatic_debit: recurring_charge.is_automatic_debit,
  };
};
