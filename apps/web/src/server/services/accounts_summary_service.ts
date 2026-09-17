import { TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";
import { current_month_start, next_month_start } from "@/lib/month_calendar";
import { calculate_account_balances } from "./account_balance_calculator";
import type { AccountsSummaryDto } from "@/types/api";

const sum_balances = (balances: Map<string, number>): number =>
  [...balances.values()].reduce((total, balance) => total + balance, 0);

export const summarize_accounts = async (workspace_id: string): Promise<AccountsSummaryDto> => {
  const month_start = current_month_start();
  const month_end = next_month_start(month_start);

  const [balances, month_groups] = await Promise.all([
    calculate_account_balances(workspace_id),
    prisma_client.transaction.groupBy({
      by: ["type"],
      where: {
        workspace_id,
        account_id: { not: null },
        status: TransactionStatus.PAID,
        type: { in: [TransactionType.INCOME, TransactionType.EXPENSE] },
        issued_at: { gte: month_start, lt: month_end },
      },
      _sum: { amount: true },
    }),
  ]);

  const month_total = (type: TransactionType): number =>
    Number(month_groups.find((group) => group.type === type)?._sum.amount ?? 0);

  return {
    total_balance: sum_balances(balances).toFixed(2),
    month_income: month_total(TransactionType.INCOME).toFixed(2),
    month_expense: month_total(TransactionType.EXPENSE).toFixed(2),
    month_start: month_start.toISOString(),
  };
};
