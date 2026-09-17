import { TransactionStatus, prisma_client } from "@fluiuae/database";
import { bad_request, conflict, not_found } from "@/lib/http_error";
import { to_transaction_dto } from "@/server/mappers/transaction_mapper";
import { build_transaction_filter } from "./transaction_filter_builder";
import { calculate_transaction_summary } from "./transaction_summary_calculator";
import { assert_category_matches_type } from "./category_kind_validator";
import { revert_statement_purchases } from "./credit_card_statement_payment_service";
import { assert_references_belong_to_workspace } from "./transaction_reference_validator";
import { transaction_include } from "./transaction_query";
import { resolve_created_status, resolve_updated_status } from "./transaction_status_rules";
import type { TransactionDto, TransactionSummaryDto } from "@/types/api";
import type {
  CreateTransactionInput,
  ListTransactionsQuery,
  UpdateTransactionInput,
} from "@/validation/transaction_schemas";

const to_nullable_date = (value: string | null | undefined): Date | null =>
  value ? new Date(value) : null;

export const list_transactions = async (
  workspace_id: string,
  query: ListTransactionsQuery
): Promise<TransactionDto[]> => {
  const transactions = await prisma_client.transaction.findMany({
    where: build_transaction_filter(workspace_id, query),
    include: transaction_include,
    orderBy: [{ issued_at: "desc" }, { created_at: "desc" }],
    take: 500,
  });

  return transactions.map(to_transaction_dto);
};

export const summarize_transactions = (
  workspace_id: string,
  query: ListTransactionsQuery
): Promise<TransactionSummaryDto> =>
  calculate_transaction_summary({
    AND: [build_transaction_filter(workspace_id, query), { statement_payment: { is: null } }],
  });

export const create_transaction = async (
  workspace_id: string,
  created_by_id: string,
  input: CreateTransactionInput
): Promise<TransactionDto> => {
  await assert_references_belong_to_workspace({
    workspace_id,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    destination_account_id: input.destination_account_id,
    category_id: input.category_id,
  });

  await assert_category_matches_type({
    workspace_id,
    type: input.type,
    category_id: input.category_id,
  });

  const transaction = await prisma_client.transaction.create({
    data: {
      workspace_id,
      created_by_id,
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      destination_account_id: input.destination_account_id ?? null,
      category_id: input.category_id ?? null,
      type: input.type,
      ...resolve_created_status(input),
      description: input.description,
      amount: input.amount,
      issued_at: new Date(input.issued_at),
      due_date: to_nullable_date(input.due_date),
      notes: input.notes ?? null,
    },
    include: transaction_include,
  });

  return to_transaction_dto(transaction);
};

export const update_transaction = async (
  workspace_id: string,
  transaction_id: string,
  input: UpdateTransactionInput
): Promise<TransactionDto> => {
  const existing_transaction = await prisma_client.transaction.findFirst({
    where: { id: transaction_id, workspace_id },
    include: { statement_payment: { select: { id: true } } },
  });

  if (!existing_transaction) {
    throw not_found("transaction_not_found");
  }

  if (existing_transaction.statement_payment) {
    throw conflict("statement_payment_locked");
  }

  await assert_references_belong_to_workspace({
    workspace_id,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    destination_account_id: input.destination_account_id,
    category_id: input.category_id,
  });

  await assert_category_matches_type({
    workspace_id,
    type: input.type,
    category_id: input.category_id,
  });

  const transaction = await prisma_client.transaction.update({
    where: { id: transaction_id },
    data: {
      account_id: input.account_id ?? null,
      credit_card_id: input.credit_card_id ?? null,
      destination_account_id: input.destination_account_id ?? null,
      category_id: input.category_id ?? null,
      type: input.type,
      ...resolve_updated_status(existing_transaction, input),
      description: input.description,
      amount: input.amount,
      issued_at: new Date(input.issued_at),
      due_date: to_nullable_date(input.due_date),
      notes: input.notes ?? null,
    },
    include: transaction_include,
  });

  return to_transaction_dto(transaction);
};

export const delete_transaction = async (
  workspace_id: string,
  transaction_id: string
): Promise<void> => {
  const existing_transaction = await prisma_client.transaction.findFirst({
    where: { id: transaction_id, workspace_id },
    include: { statement_payment: true },
  });

  if (!existing_transaction) {
    throw not_found("transaction_not_found");
  }

  const { statement_payment } = existing_transaction;

  await prisma_client.$transaction(async (transaction_client) => {
    if (statement_payment) {
      await revert_statement_purchases(transaction_client, statement_payment);
    }

    await transaction_client.transaction.delete({ where: { id: transaction_id } });
  });
};

export const settle_transaction = async (
  workspace_id: string,
  transaction_id: string
): Promise<TransactionDto> => {
  const existing_transaction = await prisma_client.transaction.findFirst({
    where: { id: transaction_id, workspace_id },
  });

  if (!existing_transaction) {
    throw not_found("transaction_not_found");
  }

  if (existing_transaction.credit_card_id) {
    throw bad_request("card_purchase_settles_with_statement");
  }

  const transaction = await prisma_client.transaction.update({
    where: { id: transaction_id },
    data: { status: TransactionStatus.PAID, paid_at: new Date() },
    include: transaction_include,
  });

  return to_transaction_dto(transaction);
};
