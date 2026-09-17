import { TransactionStatus, prisma_client, type FixedTransaction } from "@fluiuae/database";
import { settle_due_automatic_debits } from "./automatic_debit_rules";
import { resolve_generation_month } from "./generation_horizon";
import {
  build_date_in_month,
  list_months_between,
  next_month_start,
  to_month_start,
} from "@/lib/month_calendar";

const resolve_first_pending_month = (fixed_transaction: FixedTransaction): Date =>
  fixed_transaction.last_generated_month
    ? next_month_start(to_month_start(fixed_transaction.last_generated_month))
    : to_month_start(fixed_transaction.starts_at_month);

const generate_months_for_fixed_transaction = async (
  fixed_transaction: FixedTransaction,
  target_month: Date
): Promise<void> => {
  const pending_months = list_months_between(
    resolve_first_pending_month(fixed_transaction),
    target_month
  );

  if (pending_months.length === 0) {
    return;
  }

  await prisma_client.$transaction(async (transaction_client) => {
    const claim = await transaction_client.fixedTransaction.updateMany({
      where: {
        id: fixed_transaction.id,
        last_generated_month: fixed_transaction.last_generated_month,
      },
      data: { last_generated_month: target_month },
    });

    if (claim.count === 0) {
      return;
    }

    await transaction_client.transaction.createMany({
      data: pending_months.map((month_start) => {
        const scheduled_date = build_date_in_month(month_start, fixed_transaction.day_of_month);

        return {
          workspace_id: fixed_transaction.workspace_id,
          account_id: fixed_transaction.account_id,
          credit_card_id: fixed_transaction.credit_card_id,
          category_id: fixed_transaction.category_id,
          created_by_id: fixed_transaction.created_by_id,
          fixed_transaction_id: fixed_transaction.id,
          type: fixed_transaction.type,
          status: TransactionStatus.PENDING,
          is_automatic_debit: fixed_transaction.is_automatic_debit,
          description: fixed_transaction.description,
          amount: fixed_transaction.amount,
          issued_at: scheduled_date,
          due_date: scheduled_date,
        };
      }),
    });
  });
};

export const generate_due_fixed_transactions = async (
  workspace_id: string,
  requested_date?: Date | null
): Promise<void> => {
  const target_month = resolve_generation_month(requested_date);

  const fixed_transactions = await prisma_client.fixedTransaction.findMany({
    where: {
      workspace_id,
      starts_at_month: { lte: target_month },
      OR: [{ last_generated_month: null }, { last_generated_month: { lt: target_month } }],
    },
  });

  for (const fixed_transaction of fixed_transactions) {
    await generate_months_for_fixed_transaction(fixed_transaction, target_month);
  }

  await settle_due_automatic_debits(workspace_id);
};
