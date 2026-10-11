export type PartnerShare = {
  income_share: number;
  total_amount: number;
  installment_amount: number;
};

export type ProportionalSplit = {
  household_income: number;
  purchase_amount: number;
  installment_count: number;
  installment_amount: number;
  has_rounded_installments: boolean;
  first_partner: PartnerShare;
  second_partner: PartnerShare;
};

type ProportionalSplitInput = {
  first_salary: number;
  second_salary: number;
  purchase_amount: number;
  installment_count: number;
};

const to_cents = (value: number): number => Math.round(value * 100);

const split_cents = (total_cents: number, first_share: number): [number, number] => {
  const first_cents = Math.round(total_cents * first_share);

  return [first_cents, total_cents - first_cents];
};

export const calculate_proportional_split = ({
  first_salary,
  second_salary,
  purchase_amount,
  installment_count,
}: ProportionalSplitInput): ProportionalSplit => {
  const household_income = first_salary + second_salary;
  const first_income_share = first_salary / household_income;
  const purchase_cents = to_cents(purchase_amount);
  const installment_cents = Math.round(purchase_cents / installment_count);
  const [first_total_cents, second_total_cents] = split_cents(purchase_cents, first_income_share);
  const [first_installment_cents, second_installment_cents] = split_cents(installment_cents, first_income_share);

  return {
    household_income,
    purchase_amount: purchase_cents / 100,
    installment_count,
    installment_amount: installment_cents / 100,
    has_rounded_installments:
      installment_cents * installment_count !== purchase_cents ||
      first_installment_cents * installment_count !== first_total_cents,
    first_partner: {
      income_share: first_income_share,
      total_amount: first_total_cents / 100,
      installment_amount: first_installment_cents / 100,
    },
    second_partner: {
      income_share: 1 - first_income_share,
      total_amount: second_total_cents / 100,
      installment_amount: second_installment_cents / 100,
    },
  };
};
