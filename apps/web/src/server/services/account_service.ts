import { prisma_client } from "@fluiuae/database";
import { conflict, not_found } from "@/lib/http_error";
import { resolve_institution } from "@/server/institutions/institution_resolver";
import { clear_other_default_accounts } from "./default_selection_writer";
import { to_account_dto } from "@/server/mappers/account_mapper";
import { calculate_account_activity } from "./account_activity_calculator";
import { calculate_account_balances } from "./account_balance_calculator";
import type { AccountDto } from "@/types/api";
import type { CreateAccountInput, UpdateAccountInput } from "@/validation/account_schemas";

export const list_accounts = async (workspace_id: string): Promise<AccountDto[]> => {
  const [accounts, balances] = await Promise.all([
    prisma_client.account.findMany({
      where: { workspace_id },
      orderBy: [{ is_archived: "asc" }, { is_default: "desc" }, { name: "asc" }],
    }),
    calculate_account_balances(workspace_id),
  ]);

  const activity = await calculate_account_activity(workspace_id, balances);

  return accounts.map((account) =>
    to_account_dto(account, (balances.get(account.id) ?? 0).toFixed(2), activity.get(account.id))
  );
};

export const create_account = async (
  workspace_id: string,
  input: CreateAccountInput
): Promise<AccountDto> => {
  const duplicated_account = await prisma_client.account.findFirst({
    where: { workspace_id, name: input.name },
  });

  if (duplicated_account) {
    throw conflict("account_name_already_used");
  }

  const account = await prisma_client.$transaction(async (transaction_client) => {
    const created_account = await transaction_client.account.create({
      data: {
        workspace_id,
        name: input.name,
        type: input.type,
        ...resolve_institution(input),
        initial_balance: input.initial_balance,
        is_default: input.is_default,
      },
    });

    if (created_account.is_default) {
      await clear_other_default_accounts(transaction_client, workspace_id, created_account.id);
    }

    return created_account;
  });

  return to_account_dto(account, Number(account.initial_balance).toFixed(2));
};

export const update_account = async (
  workspace_id: string,
  account_id: string,
  input: UpdateAccountInput
): Promise<AccountDto> => {
  const existing_account = await prisma_client.account.findFirst({
    where: { id: account_id, workspace_id },
  });

  if (!existing_account) {
    throw not_found("account_not_found");
  }

  const account = await prisma_client.$transaction(async (transaction_client) => {
    const updated_account = await transaction_client.account.update({
      where: { id: account_id },
      data: {
        name: input.name,
        type: input.type,
        ...(input.institution !== undefined || input.institution_ispb !== undefined
          ? resolve_institution(input)
          : {}),
        initial_balance: input.initial_balance,
        is_archived: input.is_archived,
        is_default: input.is_default,
      },
    });

    if (updated_account.is_default) {
      await clear_other_default_accounts(transaction_client, workspace_id, updated_account.id);
    }

    return updated_account;
  });

  const balances = await calculate_account_balances(workspace_id);

  return to_account_dto(account, (balances.get(account.id) ?? 0).toFixed(2));
};

export const delete_account = async (workspace_id: string, account_id: string): Promise<void> => {
  const existing_account = await prisma_client.account.findFirst({
    where: { id: account_id, workspace_id },
  });

  if (!existing_account) {
    throw not_found("account_not_found");
  }

  const transaction_count = await prisma_client.transaction.count({
    where: { workspace_id, account_id },
  });

  if (transaction_count > 0) {
    throw conflict("account_has_transactions");
  }

  await prisma_client.account.delete({ where: { id: account_id } });
};
