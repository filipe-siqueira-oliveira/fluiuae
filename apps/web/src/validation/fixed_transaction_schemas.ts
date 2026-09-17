import { z } from "zod";
import { TransactionType } from "@fluiuae/database";
import { payment_source_fields, refine_payment_source } from "./payment_source_schema";

export const fixed_transaction_type_schema = z.enum([
  TransactionType.INCOME,
  TransactionType.EXPENSE,
]);

const fixed_transaction_fields = {
  description: z.string().trim().min(1).max(200),
  amount: z.coerce.number().positive(),
  day_of_month: z.coerce.number().int().min(1).max(31),
  ...payment_source_fields,
  category_id: z.string().uuid().optional().nullable(),
  is_automatic_debit: z.boolean().default(false),
};

export const create_fixed_transaction_schema = z
  .object({
    type: fixed_transaction_type_schema,
    ...fixed_transaction_fields,
  })
  .superRefine((value, context) =>
    refine_payment_source(value, context, {
      allows_credit_card: value.type === TransactionType.EXPENSE,
    })
  );

export const update_fixed_transaction_schema = z
  .object(fixed_transaction_fields)
  .superRefine((value, context) =>
    refine_payment_source(value, context, { allows_credit_card: true })
  );

export const list_fixed_transactions_query_schema = z.object({
  type: fixed_transaction_type_schema,
});

export type FixedTransactionType = z.infer<typeof fixed_transaction_type_schema>;
export type CreateFixedTransactionInput = z.infer<typeof create_fixed_transaction_schema>;
export type UpdateFixedTransactionInput = z.infer<typeof update_fixed_transaction_schema>;
