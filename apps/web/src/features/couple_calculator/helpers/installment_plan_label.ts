import { format_money } from "@/lib/money_formatter";

export const is_paid_in_installments = (installment_count: number): boolean => installment_count > 1;

export const describe_installment_plan = (installment_count: number, installment_amount: number): string =>
  is_paid_in_installments(installment_count) ? `${installment_count}x de ${format_money(installment_amount)}` : "À vista";
