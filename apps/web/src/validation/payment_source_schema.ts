import { z } from "zod";

export const payment_source_fields = {
  account_id: z.string().uuid().optional().nullable(),
  credit_card_id: z.string().uuid().optional().nullable(),
};

type PaymentSourceValue = {
  account_id?: string | null;
  credit_card_id?: string | null;
};

export const refine_payment_source = (
  value: PaymentSourceValue,
  context: z.RefinementCtx,
  options: { allows_credit_card: boolean }
): void => {
  const has_account = Boolean(value.account_id);
  const has_credit_card = Boolean(value.credit_card_id);

  if (has_account === has_credit_card) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["account_id"],
      message: "choose_account_or_credit_card",
    });
  }

  if (has_credit_card && !options.allows_credit_card) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["credit_card_id"],
      message: "credit_card_only_for_expenses",
    });
  }
};
