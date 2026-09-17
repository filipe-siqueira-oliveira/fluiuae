import { remove_future_pending, resolve_rewound_generated_month } from "./scheduled_future_reset";
import {
  resolve_automatic_debit,
  settle_due_automatic_debits,
  sync_pending_automatic_debit,
} from "./automatic_debit_rules";
import { TransactionType, prisma_client } from "@fluiuae/database";
import { bad_request, not_found } from "@/lib/http_error";
import { parse_month_string } from "@/lib/month_calendar";
import { to_recurring_charge_dto } from "@/server/mappers/recurring_charge_mapper";
import { assert_fixed_transaction_references } from "./fixed_transaction_reference_validator";
import { generate_due_recurring_charges } from "./recurring_charge_generator";
import { recurring_charge_include } from "./recurring_charge_query";
import { count_generated_installments } from "./recurring_charge_schedule";
import type { RecurringChargeDto } from "@/types/api";
import type {
  CreateRecurringChargeInput,
  UpdateRecurringChargeInput,
} from "@/validation/recurring_charge_schemas";

const find_recurring_charge_or_fail = async (workspace_id: string, recurring_charge_id: string) => {
  const recurring_charge = await prisma_client.recurringCharge.findFirst({
    where: { id: recurring_charge_id, workspace_id },
  });

  if (!recurring_charge) {
    throw not_found("recurring_charge_not_found");
  }

  return recurring_charge;
};

export const list_recurring_charges = async (workspace_id: string): Promise<RecurringChargeDto[]> => {
  const recurring_charges = await prisma_client.recurringCharge.findMany({
    where: { workspace_id },
    include: recurring_charge_include,
    orderBy: [{ starts_at_month: "asc" }, { description: "asc" }],
  });

  return recurring_charges.map(to_recurring_charge_dto);
};

export const create_recurring_charge = async (
  workspace_id: string,
  created_by_id: string,
  input: CreateRecurringChargeInput
): Promise<RecurringChargeDto> => {
  await assert_fixed_transaction_references({
    workspace_id,
    type: TransactionType.EXPENSE,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    category_id: input.category_id,
  });

  const recurring_charge = await prisma_client.recurringCharge.create({
    data: {
      workspace_id,
      created_by_id,
      description: input.description,
      installment_amount: input.installment_amount,
      installment_count: input.installment_count,
      day_of_month: input.day_of_month,
      starts_at_month: parse_month_string(input.starts_at_month),
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      category_id: input.category_id ?? null,
      is_automatic_debit: resolve_automatic_debit({ ...input, type: TransactionType.EXPENSE }),
    },
  });

  await generate_due_recurring_charges(workspace_id);

  const refreshed = await prisma_client.recurringCharge.findUniqueOrThrow({
    where: { id: recurring_charge.id },
    include: recurring_charge_include,
  });

  return to_recurring_charge_dto(refreshed);
};

export const update_recurring_charge = async (
  workspace_id: string,
  recurring_charge_id: string,
  input: UpdateRecurringChargeInput
): Promise<RecurringChargeDto> => {
  const existing_charge = await find_recurring_charge_or_fail(workspace_id, recurring_charge_id);
  const first_removed_month = await remove_future_pending({ recurring_charge_id });

  if (first_removed_month) {
    await prisma_client.recurringCharge.update({
      where: { id: recurring_charge_id },
      data: {
        last_generated_month: resolve_rewound_generated_month(first_removed_month, existing_charge.starts_at_month),
      },
    });
  }

  if (input.installment_count < count_generated_installments(existing_charge)) {
    throw bad_request("installment_count_below_generated");
  }

  await assert_fixed_transaction_references({
    workspace_id,
    type: TransactionType.EXPENSE,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    category_id: input.category_id,
  });

  const recurring_charge = await prisma_client.recurringCharge.update({
    where: { id: recurring_charge_id },
    data: {
      description: input.description,
      installment_amount: input.installment_amount,
      installment_count: input.installment_count,
      day_of_month: input.day_of_month,
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      category_id: input.category_id ?? null,
      is_automatic_debit: resolve_automatic_debit({ ...input, type: TransactionType.EXPENSE }),
    },
    include: recurring_charge_include,
  });

  await sync_pending_automatic_debit({ recurring_charge_id }, recurring_charge.is_automatic_debit);
  await generate_due_recurring_charges(workspace_id, existing_charge.last_generated_month);
  await settle_due_automatic_debits(workspace_id);

  return to_recurring_charge_dto(recurring_charge);
};

export const delete_recurring_charge = async (
  workspace_id: string,
  recurring_charge_id: string
): Promise<void> => {
  await find_recurring_charge_or_fail(workspace_id, recurring_charge_id);
  await remove_future_pending({ recurring_charge_id });
  await prisma_client.recurringCharge.delete({ where: { id: recurring_charge_id } });
};
