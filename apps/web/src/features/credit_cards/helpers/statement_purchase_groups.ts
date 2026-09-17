import dayjs from "dayjs";
import type { TransactionDto } from "@/types/api";

export type StatementPurchaseDayGroup = {
  day_key: string;
  day_label: string;
  total: number;
  purchases: TransactionDto[];
};

const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export const filter_statement_purchases = (purchases: TransactionDto[], query: string): TransactionDto[] => {
  const search_term = normalize(query.trim());

  if (!search_term) {
    return purchases;
  }

  return purchases.filter((purchase) =>
    normalize(`${purchase.description} ${purchase.category?.name ?? ""}`).includes(search_term)
  );
};

export const group_purchases_by_day = (purchases: TransactionDto[]): StatementPurchaseDayGroup[] => {
  const groups = new Map<string, StatementPurchaseDayGroup>();
  const ordered_purchases = [...purchases].sort(
    (first, second) => dayjs(first.issued_at).valueOf() - dayjs(second.issued_at).valueOf()
  );

  for (const purchase of ordered_purchases) {
    const purchase_day = dayjs(purchase.issued_at);
    const day_key = purchase_day.format("YYYY-MM-DD");
    const group = groups.get(day_key) ?? {
      day_key,
      day_label: capitalize(purchase_day.format("ddd, DD/MM").replace(".", "")),
      total: 0,
      purchases: [],
    };

    group.total += Number(purchase.amount);
    group.purchases.push(purchase);
    groups.set(day_key, group);
  }

  return [...groups.values()];
};
