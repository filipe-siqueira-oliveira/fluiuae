import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { create_category, list_categories } from "@/server/services/category_service";
import { create_category_schema } from "@/validation/category_schemas";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return list_categories(context.workspace.id);
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = create_category_schema.parse(await read_json_body(request));

    return create_category(context.workspace.id, input);
  }, 201);
