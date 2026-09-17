import type { Prisma } from "@fluiuae/database";

export const fixed_transaction_include = {
  account: { select: { id: true, name: true } },
  credit_card: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, kind: true, color: true } },
} satisfies Prisma.FixedTransactionInclude;

export type FixedTransactionWithRelations = Prisma.FixedTransactionGetPayload<{
  include: typeof fixed_transaction_include;
}>;
