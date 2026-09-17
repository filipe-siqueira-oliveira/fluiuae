import type { Prisma } from "@fluiuae/database";
import type { ListTransactionsQuery } from "@/validation/transaction_schemas";

export const build_transaction_filter = (
  workspace_id: string,
  query: ListTransactionsQuery
): Prisma.TransactionWhereInput => {
  const filter: Prisma.TransactionWhereInput = { workspace_id };

  if (query.type) {
    filter.type = query.type;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.account_id) {
    filter.OR = [
      { account_id: query.account_id },
      { destination_account_id: query.account_id },
    ];
  }

  if (query.category_id) {
    filter.category_id = query.category_id;
  }

  if (query.search) {
    filter.description = { contains: query.search, mode: "insensitive" };
  }

  if (query.start_date || query.end_date) {
    filter.issued_at = {
      ...(query.start_date ? { gte: new Date(query.start_date) } : {}),
      ...(query.end_date ? { lte: new Date(query.end_date) } : {}),
    };
  }

  return filter;
};
