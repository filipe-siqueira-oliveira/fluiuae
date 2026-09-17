import { prisma_client } from "@fluiuae/database";
import { bad_request } from "@/lib/http_error";

export const assert_references_belong_to_workspace = async (input: {
  workspace_id: string;
  account_id?: string | null;
  credit_card_id?: string | null;
  destination_account_id?: string | null;
  category_id?: string | null;
}): Promise<void> => {
  const account_ids = [...new Set([input.account_id, input.destination_account_id])].filter(
    (value): value is string => Boolean(value)
  );

  if (account_ids.length > 0) {
    const found_accounts = await prisma_client.account.count({
      where: { workspace_id: input.workspace_id, id: { in: account_ids } },
    });

    if (found_accounts !== account_ids.length) {
      throw bad_request("account_not_in_workspace");
    }
  }

  if (input.credit_card_id) {
    const found_credit_card = await prisma_client.creditCard.count({
      where: { workspace_id: input.workspace_id, id: input.credit_card_id },
    });

    if (found_credit_card === 0) {
      throw bad_request("credit_card_not_in_workspace");
    }
  }

  if (input.category_id) {
    const found_category = await prisma_client.category.count({
      where: { workspace_id: input.workspace_id, id: input.category_id },
    });

    if (found_category === 0) {
      throw bad_request("category_not_in_workspace");
    }
  }
};
