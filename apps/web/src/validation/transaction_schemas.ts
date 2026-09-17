import { z } from "zod";
import { TransactionStatus, TransactionType } from "@fluiuae/database";
import { payment_source_fields, refine_payment_source } from "./payment_source_schema";

const iso_date = z.string().datetime({ offset: true }).or(z.string().date());

const base_transaction_schema = z.object({
  type: z.nativeEnum(TransactionType),
  status: z.nativeEnum(TransactionStatus).default(TransactionStatus.PAID),
  description: z.string().trim().min(1).max(200),
  amount: z.coerce.number().positive(),
  issued_at: iso_date,
  due_date: iso_date.optional().nullable(),
  paid_at: iso_date.optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
  ...payment_source_fields,
  destination_account_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  is_automatic_debit: z.boolean().default(false),
});

type TransactionValue = z.infer<typeof base_transaction_schema>;

const refine_transaction = (value: TransactionValue, context: z.RefinementCtx) => {
  refine_payment_source(value, context, {
    allows_credit_card: value.type === TransactionType.EXPENSE,
  });

  if (value.type === TransactionType.TRANSFER) {
    if (!value.destination_account_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_account_id"],
        message: "transfer_requires_destination_account",
      });
    }

    if (value.destination_account_id === value.account_id) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_account_id"],
        message: "transfer_accounts_must_differ",
      });
    }
  }

  if (value.type !== TransactionType.TRANSFER && value.destination_account_id) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["destination_account_id"],
      message: "destination_account_only_for_transfer",
    });
  }
};

export const create_transaction_schema = base_transaction_schema.superRefine(refine_transaction);

export const update_transaction_schema = base_transaction_schema.superRefine(refine_transaction);

export const list_transactions_query_schema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
  status: z.nativeEnum(TransactionStatus).optional(),
  account_id: z.string().uuid().optional(),
  category_id: z.string().uuid().optional(),
  start_date: iso_date.optional(),
  end_date: iso_date.optional(),
  search: z.string().trim().max(200).optional(),
});

export type CreateTransactionInput = z.infer<typeof create_transaction_schema>;
export type UpdateTransactionInput = z.infer<typeof update_transaction_schema>;
export type ListTransactionsQuery = z.infer<typeof list_transactions_query_schema>;
