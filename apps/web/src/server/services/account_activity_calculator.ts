import { TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";
import { current_month_start } from "@/lib/month_calendar";

export type AccountActivity = {
  month_income: number;
  month_expense: number;
  balance_trend: number[];
};

const trend_day_count = 30;
const day_in_ms = 24 * 60 * 60 * 1000;

const start_of_today = (): Date => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const signed_effect = (
  transaction: { type: TransactionType; amount: unknown; account_id: string | null; destination_account_id: string | null },
  account_id: string
): number => {
  const amount = Number(transaction.amount);

  if (transaction.type === TransactionType.TRANSFER) {
    return transaction.destination_account_id === account_id ? amount : -amount;
  }

  return transaction.type === TransactionType.INCOME ? amount : -amount;
};

export const calculate_account_activity = async (
  workspace_id: string,
  current_balances: Map<string, number>
): Promise<Map<string, AccountActivity>> => {
  const trend_start = new Date(start_of_today().getTime() - (trend_day_count - 1) * day_in_ms);
  const month_start = current_month_start();
  const window_start = trend_start < month_start ? trend_start : month_start;

  const recent_transactions = await prisma_client.transaction.findMany({
    where: {
      workspace_id,
      status: TransactionStatus.PAID,
      issued_at: { gte: window_start },
      OR: [{ account_id: { not: null } }, { destination_account_id: { not: null } }],
    },
    select: { type: true, amount: true, issued_at: true, account_id: true, destination_account_id: true },
  });

  const activity = new Map<string, AccountActivity>();

  for (const [account_id, current_balance] of current_balances) {
    const account_transactions = recent_transactions.filter(
      (transaction) => transaction.account_id === account_id || transaction.destination_account_id === account_id
    );

    const month_transactions = account_transactions.filter(
      (transaction) => transaction.issued_at >= month_start && transaction.account_id === account_id
    );

    const balance_trend = Array.from({ length: trend_day_count }, (_, day_index) => {
      const day_end = new Date(trend_start.getTime() + (day_index + 1) * day_in_ms);
      const later_effect = account_transactions
        .filter((transaction) => transaction.issued_at >= day_end)
        .reduce((total, transaction) => total + signed_effect(transaction, account_id), 0);

      return Number((current_balance - later_effect).toFixed(2));
    });

    activity.set(account_id, {
      month_income: month_transactions
        .filter((transaction) => transaction.type === TransactionType.INCOME)
        .reduce((total, transaction) => total + Number(transaction.amount), 0),
      month_expense: month_transactions
        .filter((transaction) => transaction.type === TransactionType.EXPENSE)
        .reduce((total, transaction) => total + Number(transaction.amount), 0),
      balance_trend,
    });
  }

  return activity;
};
