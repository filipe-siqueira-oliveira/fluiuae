import { TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";

const signed_amount_by_type: Record<TransactionType, number> = {
  [TransactionType.INCOME]: 1,
  [TransactionType.EXPENSE]: -1,
  [TransactionType.TRANSFER]: -1,
};

export const calculate_account_balances = async (
  workspace_id: string
): Promise<Map<string, number>> => {
  const [outgoing_groups, incoming_transfer_groups, accounts] = await Promise.all([
    prisma_client.transaction.groupBy({
      by: ["account_id", "type"],
      where: { workspace_id, status: TransactionStatus.PAID, account_id: { not: null } },
      _sum: { amount: true },
    }),
    prisma_client.transaction.groupBy({
      by: ["destination_account_id"],
      where: {
        workspace_id,
        status: TransactionStatus.PAID,
        type: TransactionType.TRANSFER,
        destination_account_id: { not: null },
      },
      _sum: { amount: true },
    }),
    prisma_client.account.findMany({
      where: { workspace_id },
      select: { id: true, initial_balance: true },
    }),
  ]);

  const balances = new Map<string, number>();

  for (const account of accounts) {
    balances.set(account.id, Number(account.initial_balance));
  }

  for (const group of outgoing_groups) {
    if (!group.account_id) {
      continue;
    }

    const current_balance = balances.get(group.account_id) ?? 0;
    const movement = Number(group._sum.amount ?? 0) * signed_amount_by_type[group.type];
    balances.set(group.account_id, current_balance + movement);
  }

  for (const group of incoming_transfer_groups) {
    if (!group.destination_account_id) {
      continue;
    }

    const current_balance = balances.get(group.destination_account_id) ?? 0;
    balances.set(group.destination_account_id, current_balance + Number(group._sum.amount ?? 0));
  }

  return balances;
};
