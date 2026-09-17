import type { CreditCardDto } from "@/types/api";

export type CreditCardUsageLevel = "healthy" | "attention" | "exceeded";

export type CreditCardUsage = {
  used_amount: number;
  available_amount: number;
  used_ratio: number;
  used_percent: number;
  level: CreditCardUsageLevel;
};

const attention_ratio = 0.8;

export const resolve_credit_card_usage = (credit_card: CreditCardDto): CreditCardUsage => {
  const used_amount = Number(credit_card.used_amount);
  const credit_limit = Number(credit_card.credit_limit);
  const used_ratio = credit_limit > 0 ? used_amount / credit_limit : used_amount > 0 ? 1 : 0;

  return {
    used_amount,
    available_amount: Math.max(credit_limit - used_amount, 0),
    used_ratio,
    used_percent: Math.round(used_ratio * 100),
    level: used_ratio > 1 ? "exceeded" : used_ratio >= attention_ratio ? "attention" : "healthy",
  };
};
