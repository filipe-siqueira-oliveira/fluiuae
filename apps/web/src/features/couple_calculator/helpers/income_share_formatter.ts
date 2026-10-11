const income_share_formatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 1,
});

export const format_income_share = (income_share: number): string => income_share_formatter.format(income_share);
