import { TransactionType, prisma_client } from "@fluiuae/database";
import { not_found } from "@/lib/http_error";
import {
  resolve_open_statement_month,
  resolve_statement_closing_date,
  resolve_statement_due_date,
  resolve_statement_month,
} from "@/lib/credit_card_statement";
import { transaction_include } from "./transaction_query";

export const find_credit_card_or_fail = async (workspace_id: string, credit_card_id: string) => {
  const credit_card = await prisma_client.creditCard.findFirst({
    where: { id: credit_card_id, workspace_id },
  });

  if (!credit_card) {
    throw not_found("credit_card_not_found");
  }

  return credit_card;
};

type StatementCard = {
  id: string;
  workspace_id: string;
  statement_closing_day: number;
  payment_due_day: number;
};

export const load_card_purchases_by_statement = async (credit_card: StatementCard) => {
  const purchases = await prisma_client.transaction.findMany({
    where: {
      workspace_id: credit_card.workspace_id,
      credit_card_id: credit_card.id,
      type: TransactionType.EXPENSE,
    },
    include: transaction_include,
    orderBy: [{ issued_at: "desc" }, { created_at: "desc" }],
  });

  const purchases_by_month = new Map<number, typeof purchases>();

  for (const purchase of purchases) {
    const month_time = resolve_statement_month(purchase.issued_at, credit_card.statement_closing_day).getTime();
    purchases_by_month.set(month_time, [...(purchases_by_month.get(month_time) ?? []), purchase]);
  }

  return purchases_by_month;
};

export const describe_statement_dates = (credit_card: StatementCard, statement_month: Date) => ({
  closing_date: resolve_statement_closing_date(statement_month, credit_card.statement_closing_day),
  due_date: resolve_statement_due_date(
    statement_month,
    credit_card.statement_closing_day,
    credit_card.payment_due_day
  ),
});

export const resolve_card_open_month = (credit_card: StatementCard): Date =>
  resolve_open_statement_month(credit_card.statement_closing_day);
