import { z } from "zod";
import { CategoryKind } from "@fluiuae/database";

const editable_category_kind = z.enum([CategoryKind.INCOME, CategoryKind.EXPENSE]);

export const create_category_schema = z.object({
  name: z.string().trim().min(2).max(80),
  kind: editable_category_kind,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "invalid_color").transform((value) => value.toUpperCase()),
});

export const update_category_schema = create_category_schema.partial();

export const set_default_category_schema = z.object({
  kind: editable_category_kind,
  category_id: z.string().uuid().nullable(),
});

export type CreateCategoryInput = z.infer<typeof create_category_schema>;
export type UpdateCategoryInput = z.infer<typeof update_category_schema>;
export type SetDefaultCategoryInput = z.infer<typeof set_default_category_schema>;
