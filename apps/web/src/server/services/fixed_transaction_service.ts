import { remove_future_pending, resolve_rewound_generated_month } from "./scheduled_future_reset";
import {
  resolve_fixed_automatic_settlement,
  settle_due_automatic_debits,
  sync_pending_automatic_debit,
} from "./automatic_debit_rules";
import { prisma_client } from "@fluiuae/database";
import { not_found } from "@/lib/http_error";
import { current_month_start } from "@/lib/month_calendar";
import { to_fixed_transaction_dto } from "@/server/mappers/fixed_transaction_mapper";
import { assert_fixed_transaction_references } from "./fixed_transaction_reference_validator";
import { generate_due_fixed_transactions } from "./fixed_transaction_generator";
import { fixed_transaction_include } from "./fixed_transaction_query";
import type { FixedTransactionDto } from "@/types/api";
import type {
  CreateFixedTransactionInput,
  FixedTransactionType,
  UpdateFixedTransactionInput,
} from "@/validation/fixed_transaction_schemas";

const find_fixed_transaction_or_fail = async (workspace_id: string, fixed_transaction_id: string) => {
  const fixed_transaction = await prisma_client.fixedTransaction.findFirst({
    where: { id: fixed_transaction_id, workspace_id },
  });

  if (!fixed_transaction) {
    throw not_found("fixed_transaction_not_found");
  }

  return fixed_transaction;
};

export const list_fixed_transactions = async (
  workspace_id: string,
  type: FixedTransactionType
): Promise<FixedTransactionDto[]> => {
  const fixed_transactions = await prisma_client.fixedTransaction.findMany({
    where: { workspace_id, type },
    include: fixed_transaction_include,
    orderBy: [{ day_of_month: "asc" }, { description: "asc" }],
  });

  return fixed_transactions.map(to_fixed_transaction_dto);
};

export const create_fixed_transaction = async (
  workspace_id: string,
  created_by_id: string,
  input: CreateFixedTransactionInput
): Promise<FixedTransactionDto> => {
  await assert_fixed_transaction_references({ workspace_id, ...input });

  const fixed_transaction = await prisma_client.fixedTransaction.create({
    data: {
      workspace_id,
      created_by_id,
      type: input.type,
      description: input.description,
      amount: input.amount,
      day_of_month: input.day_of_month,
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      category_id: input.category_id ?? null,
      is_automatic_debit: resolve_fixed_automatic_settlement({ ...input }),
      starts_at_month: current_month_start(),
    },
    include: fixed_transaction_include,
  });

  await generate_due_fixed_transactions(workspace_id);

  return to_fixed_transaction_dto(fixed_transaction);
};

export const update_fixed_transaction = async (
  workspace_id: string,
  fixed_transaction_id: string,
  input: UpdateFixedTransactionInput
): Promise<FixedTransactionDto> => {
  const existing_fixed_transaction = await find_fixed_transaction_or_fail(
    workspace_id,
    fixed_transaction_id
  );

  await assert_fixed_transaction_references({
    workspace_id,
    type: existing_fixed_transaction.type as FixedTransactionType,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    category_id: input.category_id,
  });

  const first_removed_month = await remove_future_pending({ fixed_transaction_id });

  const fixed_transaction = await prisma_client.fixedTransaction.update({
    where: { id: fixed_transaction_id },
    data: {
      ...(first_removed_month
        ? {
            last_generated_month: resolve_rewound_generated_month(
              first_removed_month,
              existing_fixed_transaction.starts_at_month
            ),
          }
        : {}),
      description: input.description,
      amount: input.amount,
      day_of_month: input.day_of_month,
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      category_id: input.category_id ?? null,
      is_automatic_debit: resolve_fixed_automatic_settlement({ ...input, type: existing_fixed_transaction.type }),
    },
    include: fixed_transaction_include,
  });

  await sync_pending_automatic_debit({ fixed_transaction_id }, fixed_transaction.is_automatic_debit);
  await generate_due_fixed_transactions(workspace_id, existing_fixed_transaction.last_generated_month);
  await settle_due_automatic_debits(workspace_id);

  return to_fixed_transaction_dto(fixed_transaction);
};

export const delete_fixed_transaction = async (
  workspace_id: string,
  fixed_transaction_id: string
): Promise<void> => {
  await find_fixed_transaction_or_fail(workspace_id, fixed_transaction_id);
  await remove_future_pending({ fixed_transaction_id });
  await prisma_client.fixedTransaction.delete({ where: { id: fixed_transaction_id } });
};
