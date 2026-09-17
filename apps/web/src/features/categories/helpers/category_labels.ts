import { CategoryKind } from "@fluiuae/database/enums";

const category_kind_labels: Record<CategoryKind, string> = {
  [CategoryKind.INCOME]: "Receita",
  [CategoryKind.EXPENSE]: "Despesa",
};

export const translate_category_kind = (kind: CategoryKind): string =>
  category_kind_labels[kind];
