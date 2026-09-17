import type { Prisma } from "@fluiuae/database";

export const clear_other_default_credit_cards = async (
  transaction_client: Prisma.TransactionClient,
  workspace_id: string,
  kept_credit_card_id: string
): Promise<void> => {
  await transaction_client.creditCard.updateMany({
    where: { workspace_id, is_default: true, id: { not: kept_credit_card_id } },
    data: { is_default: false },
  });
};

export const clear_other_default_accounts = async (
  transaction_client: Prisma.TransactionClient,
  workspace_id: string,
  kept_account_id: string
): Promise<void> => {
  await transaction_client.account.updateMany({
    where: { workspace_id, is_default: true, id: { not: kept_account_id } },
    data: { is_default: false },
  });
};
