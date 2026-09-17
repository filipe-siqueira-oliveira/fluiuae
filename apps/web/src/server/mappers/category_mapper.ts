import type { Category } from "@fluiuae/database";
import type { CategoryDto } from "@/types/api";

export const to_category_dto = (category: Category): CategoryDto => ({
  id: category.id,
  name: category.name,
  kind: category.kind,
  color: category.color,
  is_system: category.is_system,
  is_default: category.is_default,
  is_archived: category.is_archived,
});
