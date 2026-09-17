import { TransactionType, prisma_client } from "@fluiuae/database";
import { bad_request } from "@/lib/http_error";
import { assert_category_matches_type } from "./category_kind_validator";
import { assert_references_belong_to_workspace } from "./transaction_reference_validator";
import type { FixedTransactionType } from "@/validation/fixed_transaction_schemas";

export const assert_fixed_transaction_references = async (input: {
  workspace_id: string;
  type: FixedTransactionType;
  account_id?: string | null;
  credit_card_id?: string | null;
  category_id?: string | null;
}): Promise<void> => {
  if (input.credit_card_id && input.type !== TransactionType.EXPENSE) {
    throw bad_request("credit_card_only_for_expenses");
  }

  await assert_references_belong_to_workspace({
    workspace_id: input.workspace_id,
    account_id: input.account_id,
    credit_card_id: input.credit_card_id,
    category_id: input.category_id,
  });

  await assert_category_matches_type({
    workspace_id: input.workspace_id,
    type: input.type,
    category_id: input.category_id,
  });
};
