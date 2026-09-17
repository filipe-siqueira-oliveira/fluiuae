import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { delete_account, update_account } from "@/server/services/account_service";
import { update_account_schema } from "@/validation/account_schemas";

type RouteContext = { params: Promise<{ account_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { account_id } = await route_context.params;
    const input = update_account_schema.parse(await read_json_body(request));

    return update_account(context.workspace.id, account_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { account_id } = await route_context.params;
    await delete_account(context.workspace.id, account_id);

    return { deleted: true };
  });
