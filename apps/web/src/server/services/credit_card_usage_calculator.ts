import { prisma_client } from "@fluiuae/database";
import { resolve_statement_month } from "@/lib/credit_card_statement";
import { to_cents } from "./credit_card_statement_balance";
import { posted_card_purchase_filter } from "./credit_card_statement_builder";

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
      where: { workspace_id, credit_card_id: { in: card_ids }, ...posted_card_purchase_filter() },
      select: { credit_card_id: true, amount: true, issued_at: true },
    }),
    prisma_client.creditCardStatementPayment.findMany({
      where: { workspace_id, credit_card_id: { in: card_ids } },
      select: { credit_card_id: true, statement_month: true, transaction: { select: { amount: true } } },
    }),
  ]);

  const closing_days = new Map(credit_cards.map((credit_card) => [credit_card.id, credit_card.statement_closing_day]));
  const statement_balances = new Map<string, { card_id: string; cents: number }>();

  const add_to_statement = (card_id: string, statement_month: Date, cents: number) => {
    const statement_id = `${card_id}:${statement_month.getTime()}`;
    const balance = statement_balances.get(statement_id) ?? { card_id, cents: 0 };

    statement_balances.set(statement_id, { card_id, cents: balance.cents + cents });
  };

  for (const purchase of purchases) {
    const card_id = purchase.credit_card_id as string;

    add_to_statement(
      card_id,
      resolve_statement_month(purchase.issued_at, closing_days.get(card_id) ?? 1),
      to_cents(purchase.amount)
    );
  }

  for (const payment of payments) {
    add_to_statement(payment.credit_card_id, payment.statement_month, -to_cents(payment.transaction.amount));
  }

  const usage = new Map(card_ids.map((card_id) => [card_id, 0]));

  for (const { card_id, cents } of statement_balances.values()) {
    usage.set(card_id, (usage.get(card_id) ?? 0) + Math.max(cents, 0) / 100);
  }

  return usage;
};
