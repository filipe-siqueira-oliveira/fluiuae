import { prisma_client } from "@fluiuae/database";

export const count_category_usage = async (category_id: string): Promise<number> => {
  const [transactions, fixed_transactions, recurring_charges] = await Promise.all([
    prisma_client.transaction.count({ where: { category_id } }),
    prisma_client.fixedTransaction.count({ where: { category_id } }),
    prisma_client.recurringCharge.count({ where: { category_id } }),
  ]);

  return transactions + fixed_transactions + recurring_charges;
};
