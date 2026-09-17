import { z } from "zod";
import { AccountType } from "@fluiuae/database";

export const create_account_schema = z.object({
  name: z.string().trim().min(2).max(120),
  type: z.nativeEnum(AccountType),
  institution: z.string().trim().max(120).optional().nullable(),
  institution_ispb: z
    .string()
    .regex(/^\d{8}$/)
    .optional()
    .nullable(),
  initial_balance: z.coerce.number().default(0),
  is_default: z.boolean().default(false),
});

export const update_account_schema = create_account_schema.partial().extend({
  is_archived: z.boolean().optional(),
});

export type CreateAccountInput = z.infer<typeof create_account_schema>;
export type UpdateAccountInput = z.infer<typeof update_account_schema>;
