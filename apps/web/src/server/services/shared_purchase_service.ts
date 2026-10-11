import { CategoryKind, TransactionStatus, TransactionType, prisma_client } from "@fluiuae/database";
import { bad_request } from "@/lib/http_error";
import { current_month_start } from "@/lib/month_calendar";
import { read_first_name } from "@/lib/person_name";
import { plan_shared_purchase_entries, type SharedPurchaseEntry } from "@/lib/shared_purchase_entries";
import { assert_user_can_write_workspace } from "@/server/authorization/workspace_write_access";
import { to_recurring_charge_dto } from "@/server/mappers/recurring_charge_mapper";
import { to_transaction_dto } from "@/server/mappers/transaction_mapper";
import { generate_due_recurring_charges } from "./recurring_charge_generator";
import { recurring_charge_include } from "./recurring_charge_query";
import { assert_references_belong_to_workspace } from "./transaction_reference_validator";
import { transaction_include } from "./transaction_query";
import type { RecurringChargeDto, TransactionDto } from "@/types/api";
import type { CreateSharedPurchaseInput, SharedPurchaseShareInput } from "@/validation/shared_purchase_schemas";

type PaymentSource = {
  account_id: string | null;
  credit_card_id: string | null;
};

type WorkspaceTarget = {
  payment_source: PaymentSource;
  expense_category_id: string | null;
  income_category_id: string | null;
};

type SourcedEntry = {
  entry: SharedPurchaseEntry;
  source: PaymentSource & { category_id: string | null; type: TransactionType };
};

export type SharedPurchaseResult = {
  transactions: TransactionDto[];
  recurring_charges: RecurringChargeDto[];
};

const find_receiving_account_id = async (workspace_id: string, payment_source: PaymentSource): Promise<string> => {
  if (payment_source.account_id) {
    return payment_source.account_id;
  }

  const account = await prisma_client.account.findFirst({
    where: { workspace_id, is_archived: false },
    orderBy: [{ is_default: "desc" }, { created_at: "asc" }],
    select: { id: true },
  });

  if (!account) {
    throw bad_request("workspace_without_account");
  }

  return account.id;
};

const resolve_workspace_target = async (
  user_id: string,
  share: SharedPurchaseShareInput
): Promise<WorkspaceTarget> => {
  await assert_user_can_write_workspace(user_id, share.workspace_id);

  const payment_source = { account_id: share.account_id ?? null, credit_card_id: share.credit_card_id ?? null };

  await assert_references_belong_to_workspace({ workspace_id: share.workspace_id, ...payment_source });

  const default_categories = await prisma_client.category.findMany({
    where: { workspace_id: share.workspace_id, is_default: true, is_archived: false },
    select: { id: true, kind: true },
  });

  return {
    payment_source,
    expense_category_id: default_categories.find((category) => category.kind === CategoryKind.EXPENSE)?.id ?? null,
    income_category_id: default_categories.find((category) => category.kind === CategoryKind.INCOME)?.id ?? null,
  };
};

const find_owner_first_names = async (workspace_ids: string[]): Promise<Map<string, string>> => {
  const workspaces = await prisma_client.workspace.findMany({
    where: { id: { in: workspace_ids } },
    select: { id: true, owner: { select: { name: true } } },
  });

  return new Map(workspaces.map((workspace) => [workspace.id, read_first_name(workspace.owner.name)]));
};

const attach_source = async (entry: SharedPurchaseEntry, target: WorkspaceTarget): Promise<SourcedEntry> => {
  if (entry.kind === "receivable") {
    return {
      entry,
      source: {
        account_id: await find_receiving_account_id(entry.workspace_id, target.payment_source),
        credit_card_id: null,
        category_id: target.income_category_id,
        type: TransactionType.INCOME,
      },
    };
  }

  return {
    entry,
    source: { ...target.payment_source, category_id: target.expense_category_id, type: TransactionType.EXPENSE },
  };
};

const create_single_payments = async (user_id: string, sourced_entries: SourcedEntry[]): Promise<SharedPurchaseResult> => {
  const issued_at = new Date();
  const transactions = await prisma_client.$transaction(
    sourced_entries.map(({ entry, source }) =>
      prisma_client.transaction.create({
        data: {
          workspace_id: entry.workspace_id,
          created_by_id: user_id,
          account_id: source.account_id,
          credit_card_id: source.credit_card_id,
          category_id: source.category_id,
          type: source.type,
          status: TransactionStatus.PENDING,
          is_automatic_debit: false,
          paid_at: null,
          description: entry.description,
          amount: entry.amount,
          issued_at,
          notes: entry.notes,
        },
        include: transaction_include,
      })
    )
  );

  return { transactions: transactions.map(to_transaction_dto), recurring_charges: [] };
};

const create_installment_plans = async (
  user_id: string,
  installment_count: number,
  sourced_entries: SourcedEntry[]
): Promise<SharedPurchaseResult> => {
  const starts_at_month = current_month_start();
  const day_of_month = new Date().getDate();
  const created_charges = await prisma_client.$transaction(
    sourced_entries.map(({ entry, source }) =>
      prisma_client.recurringCharge.create({
        data: {
          workspace_id: entry.workspace_id,
          created_by_id: user_id,
          type: source.type,
          description: entry.description,
          installment_amount: entry.amount,
          installment_count,
          day_of_month,
          starts_at_month,
          account_id: source.account_id,
          credit_card_id: source.credit_card_id,
          category_id: source.category_id,
          is_automatic_debit: false,
        },
        select: { id: true, workspace_id: true },
      })
    )
  );

  for (const workspace_id of new Set(created_charges.map((charge) => charge.workspace_id))) {
    await generate_due_recurring_charges(workspace_id);
  }

  const recurring_charges = await prisma_client.recurringCharge.findMany({
    where: { id: { in: created_charges.map((charge) => charge.id) } },
    include: recurring_charge_include,
  });

  return { transactions: [], recurring_charges: recurring_charges.map(to_recurring_charge_dto) };
};

export const create_shared_purchase = async (
  user_id: string,
  input: CreateSharedPurchaseInput
): Promise<SharedPurchaseResult> => {
  const [first_share, second_share] = input.shares;
  const [owner_first_names, first_target, second_target] = await Promise.all([
    find_owner_first_names([first_share.workspace_id, second_share.workspace_id]),
    resolve_workspace_target(user_id, first_share),
    resolve_workspace_target(user_id, second_share),
  ]);
  const read_target = (workspace_id: string): WorkspaceTarget =>
    workspace_id === first_share.workspace_id ? first_target : second_target;
  const to_participant = (share: SharedPurchaseShareInput) => ({
    workspace_id: share.workspace_id,
    person_name: owner_first_names.get(share.workspace_id) ?? "Outra pessoa",
    amount: share.amount,
  });

  const entries = plan_shared_purchase_entries({
    description: input.description,
    payer_workspace_id: input.payer_workspace_id,
    installment_count: input.installment_count,
    participants: [to_participant(first_share), to_participant(second_share)],
  });
  const sourced_entries = await Promise.all(entries.map((entry) => attach_source(entry, read_target(entry.workspace_id))));

  return input.installment_count > 1
    ? create_installment_plans(user_id, input.installment_count, sourced_entries)
    : create_single_payments(user_id, sourced_entries);
};
