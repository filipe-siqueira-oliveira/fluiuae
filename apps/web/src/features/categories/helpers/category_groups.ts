import type { CategoryKind } from "@fluiuae/database/enums";
import type { CategoryDto } from "@/types/api";

export type CategorySections = {
  custom: CategoryDto[];
  system: CategoryDto[];
};

const sort_by_name = (first: CategoryDto, second: CategoryDto): number =>
  first.name.localeCompare(second.name, "pt-BR");

export const count_categories_by_kind = (categories: CategoryDto[], kind: CategoryKind): number =>
  categories.filter((category) => category.kind === kind).length;

export const build_category_sections = (categories: CategoryDto[], kind: CategoryKind): CategorySections => {
  const same_kind = categories.filter((category) => category.kind === kind).sort(sort_by_name);

  return {
    custom: same_kind.filter((category) => !category.is_system),
    system: same_kind.filter((category) => category.is_system),
  };
};
