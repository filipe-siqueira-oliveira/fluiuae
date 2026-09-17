import { TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";

type DebitSource = {
  type: TransactionType;
  account_id?: string | null;
  credit_card_id?: string | null;
  is_automatic_debit?: boolean;
};

export const resolve_automatic_debit = (source: DebitSource): boolean =>
  Boolean(
    source.is_automatic_debit &&
      source.type === TransactionType.EXPENSE &&
      source.account_id &&
      !source.credit_card_id
  );

export const resolve_fixed_automatic_settlement = (source: DebitSource): boolean =>
  source.type === TransactionType.INCOME ? Boolean(source.account_id) : resolve_automatic_debit(source);

export const end_of_today = (): Date => {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
};

export const settle_due_automatic_debits = async (workspace_id: string): Promise<void> => {
  await prisma_client.$executeRaw`
    UPDATE "transactions"
    SET "status" = ${TransactionStatus.PAID}::"TransactionStatus",
        "paid_at" = "issued_at",
        "updated_at" = NOW()
    WHERE "workspace_id" = ${workspace_id}::uuid
      AND "is_automatic_debit" = true
      AND "status" = ${TransactionStatus.PENDING}::"TransactionStatus"
      AND "account_id" IS NOT NULL
      AND "credit_card_id" IS NULL
      AND "issued_at" <= ${end_of_today()}
  `;
};

export const sync_pending_automatic_debit = async (
  where: { fixed_transaction_id: string } | { recurring_charge_id: string },
  is_automatic_debit: boolean
): Promise<void> => {
  await prisma_client.transaction.updateMany({
    where: { ...where, status: TransactionStatus.PENDING },
    data: { is_automatic_debit },
  });
};
