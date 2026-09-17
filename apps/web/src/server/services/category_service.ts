import { type CategoryKind, prisma_client } from "@fluiuae/database";
import { bad_request, conflict, forbidden, not_found } from "@/lib/http_error";
import { is_system_category } from "@/lib/category_compatibility";
import { to_category_dto } from "@/server/mappers/category_mapper";
import { count_category_usage } from "./category_usage_counter";
import type { CategoryDto } from "@/types/api";
import type { CreateCategoryInput, UpdateCategoryInput } from "@/validation/category_schemas";

export type CategoryRemovalResult = "deleted" | "archived";

const find_editable_category_or_fail = async (workspace_id: string, category_id: string) => {
  const category = await prisma_client.category.findFirst({
    where: { id: category_id, workspace_id, is_archived: false },
  });

  if (!category) {
    throw not_found("category_not_found");
  }

  if (is_system_category(category)) {
    throw forbidden("system_category_locked");
  }

  return category;
};

export const list_categories = async (workspace_id: string): Promise<CategoryDto[]> => {
  const categories = await prisma_client.category.findMany({
    where: { workspace_id, is_archived: false },
    orderBy: [{ kind: "asc" }, { name: "asc" }],
  });

  return categories.map(to_category_dto);
};

export const create_category = async (
  workspace_id: string,
  input: CreateCategoryInput
): Promise<CategoryDto> => {
  const same_name_category = await prisma_client.category.findFirst({
    where: { workspace_id, name: input.name, kind: input.kind },
  });

  if (same_name_category && !same_name_category.is_archived) {
    throw conflict("category_already_exists");
  }

  if (same_name_category) {
    const restored_category = await prisma_client.category.update({
      where: { id: same_name_category.id },
      data: { is_archived: false, color: input.color },
    });

    return to_category_dto(restored_category);
  }

  const category = await prisma_client.category.create({
    data: { workspace_id, name: input.name, kind: input.kind, color: input.color },
  });

  return to_category_dto(category);
};

export const update_category = async (
  workspace_id: string,
  category_id: string,
  input: UpdateCategoryInput
): Promise<CategoryDto> => {
  const existing_category = await find_editable_category_or_fail(workspace_id, category_id);
  const next_name = input.name ?? existing_category.name;
  const next_kind = input.kind ?? existing_category.kind;

  const same_name_category = await prisma_client.category.findFirst({
    where: { workspace_id, name: next_name, kind: next_kind, id: { not: category_id } },
  });

  if (same_name_category) {
    throw conflict("category_already_exists");
  }

  const category = await prisma_client.category.update({
    where: { id: category_id },
    data: {
      name: input.name,
      kind: input.kind,
      color: input.color,
      ...(next_kind !== existing_category.kind ? { is_default: false } : {}),
    },
  });

  return to_category_dto(category);
};

export const set_default_category = async (
  workspace_id: string,
  kind: CategoryKind,
  category_id: string | null
): Promise<void> => {
  await prisma_client.$transaction(async (transaction_client) => {
    if (category_id) {
      const category = await transaction_client.category.findFirst({
        where: { id: category_id, workspace_id, is_archived: false },
      });

      if (!category) {
        throw not_found("category_not_found");
      }

      if (category.kind !== kind) {
        throw bad_request("category_kind_does_not_match_type");
      }
    }

    await transaction_client.category.updateMany({
      where: { workspace_id, kind, is_default: true, id: { not: category_id ?? undefined } },
      data: { is_default: false },
    });

    if (category_id) {
      await transaction_client.category.update({
        where: { id: category_id },
        data: { is_default: true },
      });
    }
  });
};

export const delete_category = async (
  workspace_id: string,
  category_id: string
): Promise<CategoryRemovalResult> => {
  await find_editable_category_or_fail(workspace_id, category_id);

  if ((await count_category_usage(category_id)) > 0) {
    await prisma_client.category.update({
      where: { id: category_id },
      data: { is_archived: true, is_default: false },
    });

    return "archived";
  }

  await prisma_client.category.delete({ where: { id: category_id } });

  return "deleted";
};
