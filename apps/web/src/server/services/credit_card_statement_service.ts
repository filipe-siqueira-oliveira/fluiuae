import { prisma_client } from "@fluiuae/database";
import {
  resolve_statement_phase,
  resolve_statement_status,
  to_statement_key,
} from "@/lib/credit_card_statement";
import { to_transaction_dto } from "@/server/mappers/transaction_mapper";
import {
  describe_statement_dates,
  find_credit_card_or_fail,
  load_card_purchases_by_statement,
  resolve_card_open_month,
} from "./credit_card_statement_builder";
import type { CreditCardStatementDetailDto } from "@/types/api";

export const list_credit_card_statements = async (
  workspace_id: string,
  credit_card_id: string
): Promise<CreditCardStatementDetailDto[]> => {
  const credit_card = await find_credit_card_or_fail(workspace_id, credit_card_id);
  const open_month = resolve_card_open_month(credit_card);

  const [purchases_by_month, payments] = await Promise.all([
    load_card_purchases_by_statement(credit_card),
    prisma_client.creditCardStatementPayment.findMany({
      where: { workspace_id, credit_card_id },
      include: {
        transaction: {
          select: { id: true, amount: true, paid_at: true, issued_at: true, account: { select: { id: true, name: true } } },
        },
      },
    }),
  ]);

  const payments_by_month = new Map(payments.map((payment) => [payment.statement_month.getTime(), payment]));
  const month_times = new Set([open_month.getTime(), ...purchases_by_month.keys(), ...payments_by_month.keys()]);

  return [...month_times]
    .sort((first_time, second_time) => second_time - first_time)
    .map((month_time) => {
      const statement_month = new Date(month_time);
      const purchases = purchases_by_month.get(month_time) ?? [];
      const payment = payments_by_month.get(month_time) ?? null;
      const { closing_date, due_date } = describe_statement_dates(credit_card, statement_month);
      const total = purchases.reduce((sum, purchase) => sum + Number(purchase.amount), 0);

      return {
        statement_key: to_statement_key(statement_month),
        statement_month: statement_month.toISOString(),
        closing_date: closing_date.toISOString(),
        due_date: due_date.toISOString(),
        phase: resolve_statement_phase(statement_month, open_month),
        status: resolve_statement_status({ is_paid: Boolean(payment), due_date }),
        total: total.toFixed(2),
        payment: payment
          ? {
              transaction_id: payment.transaction.id,
              amount: Number(payment.transaction.amount).toFixed(2),
              paid_at: (payment.transaction.paid_at ?? payment.transaction.issued_at).toISOString(),
              account: payment.transaction.account,
            }
          : null,
        purchases: purchases.map(to_transaction_dto),
      };
    });
};
