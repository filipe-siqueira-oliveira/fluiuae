import { format_money } from "@/lib/money_formatter";

export type MoneyParts = {
  sign: string;
  currency: string;
  integer: string;
  cents: string;
};

export const split_money = (value: string | number): MoneyParts => {
  const formatted = format_money(value).replace(/\s/g, " ");
  const match = formatted.match(/^(-?)\s?(R\$)\s?([\d.]+),(\d{2})$/);

  if (!match) {
    return { sign: "", currency: "R$", integer: formatted, cents: "" };
  }

  return { sign: match[1], currency: match[2], integer: match[3], cents: `,${match[4]}` };
};
