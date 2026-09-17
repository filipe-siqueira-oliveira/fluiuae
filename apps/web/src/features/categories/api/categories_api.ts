import { http_client, unwrap_response } from "@/lib/http_client";
import type { CategoryDto } from "@/types/api";
import type { CategoryKind } from "@fluiuae/database/enums";

export type CategoryPayload = {
  name: string;
  kind: CategoryKind;
  color: string;
};

export const fetch_categories = async (): Promise<CategoryDto[]> => {
  const response = await http_client.get("/categories");

  return unwrap_response(response.data);
};

export const create_category_request = async (payload: CategoryPayload): Promise<void> => {
  await http_client.post("/categories", payload);
};

export const update_category_request = async (
  category_id: string,
  payload: CategoryPayload
): Promise<void> => {
  await http_client.patch(`/categories/${category_id}`, payload);
};

export const delete_category_request = async (category_id: string): Promise<void> => {
  await http_client.delete(`/categories/${category_id}`);
};

export const set_default_category_request = async (
  kind: CategoryKind,
  category_id: string | null
): Promise<void> => {
  await http_client.put("/categories/defaults", { kind, category_id });
};
