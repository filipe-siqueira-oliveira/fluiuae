import { prisma_client } from "@fluiuae/database";
import { find_credit_card_or_fail } from "./credit_card_statement_builder";
import { count_generated_installments } from "./recurring_charge_schedule";
import type { CreditCardCommitmentsDto } from "@/types/api";

export const summarize_credit_card_commitments = async (
  workspace_id: string,
  credit_card_id: string
): Promise<CreditCardCommitmentsDto> => {
  await find_credit_card_or_fail(workspace_id, credit_card_id);

  const recurring_charges = await prisma_client.recurringCharge.findMany({
    where: { workspace_id, credit_card_id },
    select: { installment_amount: true, installment_count: true, starts_at_month: true, last_generated_month: true },
  });

  const pending_charges = recurring_charges
    .map((charge) => ({
      amount: Number(charge.installment_amount),
      remaining_count: charge.installment_count - count_generated_installments(charge),
    }))
    .filter((charge) => charge.remaining_count > 0);

  return {
    remaining_amount: pending_charges
      .reduce((total, charge) => total + charge.amount * charge.remaining_count, 0)
      .toFixed(2),
    installment_count: pending_charges.reduce((total, charge) => total + charge.remaining_count, 0),
    purchase_count: pending_charges.length,
  };
};
