type AmountSource = { amount: unknown };

type PaymentSource = { transaction: AmountSource };

export type StatementBalance = {
  total_cents: number;
  paid_cents: number;
  remaining_cents: number;
  is_settled: boolean;
};

export const to_cents = (value: unknown): number => Math.round(Number(value) * 100);

export const from_cents = (cents: number): string => (cents / 100).toFixed(2);

const sum_cents = (items: AmountSource[]): number => items.reduce((total, item) => total + to_cents(item.amount), 0);

export const summarize_statement_balance = (purchases: AmountSource[], payments: PaymentSource[]): StatementBalance => {
  const total_cents = sum_cents(purchases);
  const paid_cents = sum_cents(payments.map((payment) => payment.transaction));

  return {
    total_cents,
    paid_cents,
    remaining_cents: Math.max(total_cents - paid_cents, 0),
    is_settled: payments.length > 0 && paid_cents >= total_cents,
  };
};
