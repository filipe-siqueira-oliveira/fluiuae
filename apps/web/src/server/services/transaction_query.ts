import type { Prisma } from "@fluiuae/database";

export const transaction_include = {
  account: { select: { id: true, name: true } },
  credit_card: { select: { id: true, name: true, statement_closing_day: true, payment_due_day: true } },
  destination_account: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, kind: true, color: true } },
  created_by: { select: { id: true, name: true } },
  recurring_charge: { select: { installment_count: true } },
  statement_payment: { select: { id: true } },
} satisfies Prisma.TransactionInclude;

export type TransactionWithRelations = Prisma.TransactionGetPayload<{
  include: typeof transaction_include;
}>;
