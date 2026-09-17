import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { delete_category, update_category } from "@/server/services/category_service";
import { update_category_schema } from "@/validation/category_schemas";

type RouteContext = { params: Promise<{ category_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { category_id } = await route_context.params;
    const input = update_category_schema.parse(await read_json_body(request));

    return update_category(context.workspace.id, category_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { category_id } = await route_context.params;
    const result = await delete_category(context.workspace.id, category_id);

    return { result };
  });
