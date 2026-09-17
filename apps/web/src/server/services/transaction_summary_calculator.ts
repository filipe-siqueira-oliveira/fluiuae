import { TransactionStatus, TransactionType, prisma_client, type Prisma } from "@fluiuae/database";
import type { TransactionSummaryDto } from "@/types/api";

const find_total = (
  groups: { type: TransactionType; status: TransactionStatus; _sum: { amount: unknown } }[],
  type: TransactionType,
  status: TransactionStatus
): number => {
  const group = groups.find((item) => item.type === type && item.status === status);

  return Number(group?._sum.amount ?? 0);
};

export const calculate_transaction_summary = async (
  filter: Prisma.TransactionWhereInput
): Promise<TransactionSummaryDto> => {
  const groups = await prisma_client.transaction.groupBy({
    by: ["type", "status"],
    where: filter,
    _sum: { amount: true },
  });

  const total_income_paid = find_total(groups, TransactionType.INCOME, TransactionStatus.PAID);
  const total_income_pending = find_total(
    groups,
    TransactionType.INCOME,
    TransactionStatus.PENDING
  );
  const total_expense_paid = find_total(groups, TransactionType.EXPENSE, TransactionStatus.PAID);
  const total_expense_pending = find_total(
    groups,
    TransactionType.EXPENSE,
    TransactionStatus.PENDING
  );

  return {
    total_income_paid: total_income_paid.toFixed(2),
    total_income_pending: total_income_pending.toFixed(2),
    total_expense_paid: total_expense_paid.toFixed(2),
    total_expense_pending: total_expense_pending.toFixed(2),
    net_balance: (total_income_paid - total_expense_paid).toFixed(2),
  };
};
