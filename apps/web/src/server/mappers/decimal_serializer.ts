import type { Prisma } from "@fluiuae/database";

type DecimalLike = Prisma.Decimal | number | string | null | undefined;

export const serialize_decimal = (value: DecimalLike): string => {
  if (value === null || value === undefined) {
    return "0.00";
  }

  return Number(value.toString()).toFixed(2);
};

export const serialize_optional_decimal = (value: DecimalLike): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  return serialize_decimal(value);
};

export const serialize_date = (value: Date | null | undefined): string | null =>
  value ? value.toISOString() : null;
