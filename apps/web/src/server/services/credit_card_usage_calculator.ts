import { TransactionType, prisma_client } from "@fluiuae/database";
import { resolve_statement_month } from "@/lib/credit_card_statement";

type UsageCard = {
  id: string;
  statement_closing_day: number;
};

export const calculate_credit_card_usage = async (
  workspace_id: string,
  credit_cards: UsageCard[]
): Promise<Map<string, number>> => {
  const card_ids = credit_cards.map((credit_card) => credit_card.id);

  const [purchases, payments] = await Promise.all([
    prisma_client.transaction.findMany({
      where: { workspace_id, credit_card_id: { in: card_ids }, type: TransactionType.EXPENSE },
      select: { credit_card_id: true, amount: true, issued_at: true },
    }),
    prisma_client.creditCardStatementPayment.findMany({
      where: { workspace_id, credit_card_id: { in: card_ids } },
      select: { credit_card_id: true, statement_month: true },
    }),
  ]);

  const paid_statements = new Set(
    payments.map((payment) => `${payment.credit_card_id}:${payment.statement_month.getTime()}`)
  );
  const closing_days = new Map(credit_cards.map((credit_card) => [credit_card.id, credit_card.statement_closing_day]));
  const usage = new Map(card_ids.map((card_id) => [card_id, 0]));

  for (const purchase of purchases) {
    const card_id = purchase.credit_card_id as string;
    const statement_time = resolve_statement_month(purchase.issued_at, closing_days.get(card_id) ?? 1).getTime();

    if (!paid_statements.has(`${card_id}:${statement_time}`)) {
      usage.set(card_id, (usage.get(card_id) ?? 0) + Number(purchase.amount));
    }
  }

  return usage;
};
