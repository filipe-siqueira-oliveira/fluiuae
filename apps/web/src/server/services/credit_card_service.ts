import { prisma_client } from "@fluiuae/database";
import { conflict, not_found } from "@/lib/http_error";
import { to_credit_card_dto } from "@/server/mappers/credit_card_mapper";
import { resolve_institution } from "@/server/institutions/institution_resolver";
import { calculate_credit_card_usage } from "./credit_card_usage_calculator";
import { clear_other_default_credit_cards } from "./default_selection_writer";
import type { CreditCardDto } from "@/types/api";
import type {
  CreateCreditCardInput,
  UpdateCreditCardInput,
} from "@/validation/credit_card_schemas";

const find_credit_card_or_fail = async (workspace_id: string, credit_card_id: string) => {
  const credit_card = await prisma_client.creditCard.findFirst({
    where: { id: credit_card_id, workspace_id },
  });

  if (!credit_card) {
    throw not_found("credit_card_not_found");
  }

  return credit_card;
};

const assert_unique_name = async (workspace_id: string, name: string, ignored_id?: string) => {
  const same_name_card = await prisma_client.creditCard.findFirst({
    where: { workspace_id, name, ...(ignored_id ? { id: { not: ignored_id } } : {}) },
  });

  if (same_name_card) {
    throw conflict("credit_card_name_already_used");
  }
};

export const list_credit_cards = async (workspace_id: string): Promise<CreditCardDto[]> => {
  const credit_cards = await prisma_client.creditCard.findMany({
    where: { workspace_id },
    orderBy: [{ is_default: "desc" }, { name: "asc" }],
  });
  const usage = await calculate_credit_card_usage(workspace_id, credit_cards);

  return credit_cards.map((credit_card) => to_credit_card_dto(credit_card, usage.get(credit_card.id)));
};

export const create_credit_card = async (
  workspace_id: string,
  input: CreateCreditCardInput
): Promise<CreditCardDto> => {
  await assert_unique_name(workspace_id, input.name);

  const credit_card = await prisma_client.$transaction(async (transaction_client) => {
    const created_card = await transaction_client.creditCard.create({
      data: {
        workspace_id,
        name: input.name,
        ...resolve_institution(input),
        credit_limit: input.credit_limit,
        statement_closing_day: input.statement_closing_day,
        payment_due_day: input.payment_due_day,
        is_default: input.is_default,
      },
    });

    if (created_card.is_default) {
      await clear_other_default_credit_cards(transaction_client, workspace_id, created_card.id);
    }

    return created_card;
  });

  return to_credit_card_dto(credit_card);
};

export const update_credit_card = async (
  workspace_id: string,
  credit_card_id: string,
  input: UpdateCreditCardInput
): Promise<CreditCardDto> => {
  await find_credit_card_or_fail(workspace_id, credit_card_id);

  if (input.name) {
    await assert_unique_name(workspace_id, input.name, credit_card_id);
  }

  const credit_card = await prisma_client.$transaction(async (transaction_client) => {
    const updated_card = await transaction_client.creditCard.update({
      where: { id: credit_card_id },
      data: {
        name: input.name,
        ...(input.institution !== undefined || input.institution_ispb !== undefined
          ? resolve_institution(input)
          : {}),
        credit_limit: input.credit_limit,
        statement_closing_day: input.statement_closing_day,
        payment_due_day: input.payment_due_day,
        is_default: input.is_default,
      },
    });

    if (updated_card.is_default) {
      await clear_other_default_credit_cards(transaction_client, workspace_id, updated_card.id);
    }

    return updated_card;
  });

  return to_credit_card_dto(credit_card);
};

export const delete_credit_card = async (
  workspace_id: string,
  credit_card_id: string
): Promise<void> => {
  await find_credit_card_or_fail(workspace_id, credit_card_id);

  const [transactions, fixed_transactions, recurring_charges] = await Promise.all([
    prisma_client.transaction.count({ where: { credit_card_id } }),
    prisma_client.fixedTransaction.count({ where: { credit_card_id } }),
    prisma_client.recurringCharge.count({ where: { credit_card_id } }),
  ]);

  if (transactions + fixed_transactions + recurring_charges > 0) {
    throw conflict("credit_card_has_transactions");
  }

  await prisma_client.creditCard.delete({ where: { id: credit_card_id } });
};
