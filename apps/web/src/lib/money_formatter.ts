const brazilian_currency_formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const format_money = (value: string | number): string =>
  brazilian_currency_formatter.format(Number(value));

export const parse_money = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  return Number(value);
};
