import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { set_default_category } from "@/server/services/category_service";
import { set_default_category_schema } from "@/validation/category_schemas";

export const PUT = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = set_default_category_schema.parse(await read_json_body(request));
    await set_default_category(context.workspace.id, input.kind, input.category_id);

    return { kind: input.kind, category_id: input.category_id };
  });
