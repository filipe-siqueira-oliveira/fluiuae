import { z } from "zod";

export const statement_key_schema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "invalid_statement");

export const pay_credit_card_statement_schema = z.object({
  account_id: z.string().uuid(),
  paid_at: z.string().datetime({ offset: true }).or(z.string().date()),
});

export type PayCreditCardStatementInput = z.infer<typeof pay_credit_card_statement_schema>;
