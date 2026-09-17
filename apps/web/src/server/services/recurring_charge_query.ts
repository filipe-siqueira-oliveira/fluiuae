import type { Prisma } from "@fluiuae/database";

export const recurring_charge_include = {
  account: { select: { id: true, name: true } },
  credit_card: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, kind: true, color: true } },
} satisfies Prisma.RecurringChargeInclude;

export type RecurringChargeWithRelations = Prisma.RecurringChargeGetPayload<{
  include: typeof recurring_charge_include;
}>;
