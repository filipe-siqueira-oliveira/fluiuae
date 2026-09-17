import { z } from "zod";

const day_of_month = z.coerce.number().int().min(1).max(31);

export const create_credit_card_schema = z.object({
  name: z.string().trim().min(2).max(120),
  institution: z.string().trim().max(120).optional().nullable(),
  institution_ispb: z
    .string()
    .regex(/^\d{8}$/)
    .optional()
    .nullable(),
  credit_limit: z.coerce.number().positive(),
  statement_closing_day: day_of_month,
  payment_due_day: day_of_month,
  is_default: z.boolean().default(false),
});

export const update_credit_card_schema = create_credit_card_schema.partial();

export type CreateCreditCardInput = z.infer<typeof create_credit_card_schema>;
export type UpdateCreditCardInput = z.infer<typeof update_credit_card_schema>;
