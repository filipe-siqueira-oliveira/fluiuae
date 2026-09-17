import type { CategoryKind } from "@fluiuae/database/enums";

type CategoryOptionSource = {
  id: string;
  name: string;
  kind: CategoryKind;
  color: string;
  is_archived?: boolean;
};

export type CategorySelectOption = {
  value: string;
  label: string;
  color: string;
};

export const build_category_select_options = (
  categories: CategoryOptionSource[],
  kind: CategoryKind,
  current_category: CategoryOptionSource | null | undefined
): CategorySelectOption[] => {
  const options = categories
    .filter((category) => category.kind === kind && !category.is_archived)
    .map((category) => ({ value: category.id, label: category.name, color: category.color }));
  const is_current_missing =
    current_category?.kind === kind && !options.some((option) => option.value === current_category.id);

  if (current_category && is_current_missing) {
    options.push({
      value: current_category.id,
      label: `${current_category.name} (arquivada)`,
      color: current_category.color,
    });
  }

  return options;
};
