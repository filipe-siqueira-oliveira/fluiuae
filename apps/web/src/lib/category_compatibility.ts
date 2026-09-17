import { CategoryKind } from "@fluiuae/database/enums";

type DefaultCategorySource = {
  id: string;
  kind: CategoryKind;
  is_default: boolean;
  is_archived: boolean;
};

export const is_system_category = (category: { is_system: boolean }): boolean => category.is_system;

export const is_category_compatible = (
  kind: CategoryKind,
  type: typeof CategoryKind.INCOME | typeof CategoryKind.EXPENSE
): boolean => kind === type;

export const find_default_category_id = (
  categories: DefaultCategorySource[],
  kind: CategoryKind
): string | null =>
  categories.find((category) => category.kind === kind && category.is_default && !category.is_archived)
    ?.id ?? null;
