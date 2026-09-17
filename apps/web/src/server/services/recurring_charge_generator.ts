import { settle_due_automatic_debits } from "./automatic_debit_rules";
import { resolve_generation_month } from "./generation_horizon";
import {
  TransactionStatus,
  TransactionType,
  prisma_client,
  type RecurringCharge,
} from "@fluiuae/database";
import {
  build_date_in_month,
  earliest_month,
  list_months_between,
  next_month_start,
  to_month_start,
} from "@/lib/month_calendar";
import {
  resolve_installment_number,
  resolve_last_installment_month,
} from "./recurring_charge_schedule";

const resolve_first_pending_month = (recurring_charge: RecurringCharge): Date =>
  recurring_charge.last_generated_month
    ? next_month_start(to_month_start(recurring_charge.last_generated_month))
    : to_month_start(recurring_charge.starts_at_month);

const generate_installments = async (
  recurring_charge: RecurringCharge,
  current_month: Date
): Promise<void> => {
  const target_month = earliest_month(
    current_month,
    resolve_last_installment_month(recurring_charge)
  );
  const pending_months = list_months_between(
    resolve_first_pending_month(recurring_charge),
    target_month
  );

  if (pending_months.length === 0) {
    return;
  }

  await prisma_client.$transaction(async (transaction_client) => {
    const claim = await transaction_client.recurringCharge.updateMany({
      where: {
        id: recurring_charge.id,
        last_generated_month: recurring_charge.last_generated_month,
      },
      data: { last_generated_month: target_month },
    });

    if (claim.count === 0) {
      return;
    }

    await transaction_client.transaction.createMany({
      data: pending_months.map((month_start) => {
        const scheduled_date = build_date_in_month(month_start, recurring_charge.day_of_month);

        return {
          workspace_id: recurring_charge.workspace_id,
          account_id: recurring_charge.account_id,
          credit_card_id: recurring_charge.credit_card_id,
          category_id: recurring_charge.category_id,
          created_by_id: recurring_charge.created_by_id,
          recurring_charge_id: recurring_charge.id,
          installment_number: resolve_installment_number(
            recurring_charge.starts_at_month,
            month_start
          ),
          type: TransactionType.EXPENSE,
          status: TransactionStatus.PENDING,
          is_automatic_debit: recurring_charge.is_automatic_debit,
          description: recurring_charge.description,
          amount: recurring_charge.installment_amount,
          issued_at: scheduled_date,
          due_date: scheduled_date,
        };
      }),
    });
  });
};

export const generate_due_recurring_charges = async (
  workspace_id: string,
  requested_date?: Date | null
): Promise<void> => {
  const current_month = resolve_generation_month(requested_date);

  const recurring_charges = await prisma_client.recurringCharge.findMany({
    where: {
      workspace_id,
      starts_at_month: { lte: current_month },
      OR: [{ last_generated_month: null }, { last_generated_month: { lt: current_month } }],
    },
  });

  for (const recurring_charge of recurring_charges) {
    await generate_installments(recurring_charge, current_month);
  }

  await settle_due_automatic_debits(workspace_id);
};
