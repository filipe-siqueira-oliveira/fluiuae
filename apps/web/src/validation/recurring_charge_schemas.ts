import { z } from "zod";
import { payment_source_fields, refine_payment_source } from "./payment_source_schema";

const recurring_charge_fields = {
  description: z.string().trim().min(1).max(200),
  installment_amount: z.coerce.number().positive(),
  installment_count: z.coerce.number().int().min(2).max(420),
  day_of_month: z.coerce.number().int().min(1).max(31),
  ...payment_source_fields,
  category_id: z.string().uuid().optional().nullable(),
  is_automatic_debit: z.boolean().default(false),
};

export const create_recurring_charge_schema = z
  .object({
    ...recurring_charge_fields,
    starts_at_month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
  })
  .superRefine((value, context) =>
    refine_payment_source(value, context, { allows_credit_card: true })
  );

export const update_recurring_charge_schema = z
  .object(recurring_charge_fields)
  .superRefine((value, context) =>
    refine_payment_source(value, context, { allows_credit_card: true })
  );

export type CreateRecurringChargeInput = z.infer<typeof create_recurring_charge_schema>;
export type UpdateRecurringChargeInput = z.infer<typeof update_recurring_charge_schema>;
