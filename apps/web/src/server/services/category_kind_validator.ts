import { TransactionType, prisma_client } from "@fluiuae/database";
import { bad_request } from "@/lib/http_error";

export const assert_category_matches_type = async (input: {
  workspace_id: string;
  type: TransactionType;
  category_id?: string | null;
}): Promise<void> => {
  if (!input.category_id) {
    return;
  }

  if (input.type === TransactionType.TRANSFER) {
    throw bad_request("transfer_cannot_have_category");
  }

  const matching_category = await prisma_client.category.count({
    where: {
      id: input.category_id,
      workspace_id: input.workspace_id,
      kind: input.type,
    },
  });

  if (matching_category === 0) {
    throw bad_request("category_kind_does_not_match_type");
  }
};
