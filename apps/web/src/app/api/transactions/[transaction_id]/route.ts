import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { delete_transaction, update_transaction } from "@/server/services/transaction_service";
import { update_transaction_schema } from "@/validation/transaction_schemas";

type RouteContext = { params: Promise<{ transaction_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { transaction_id } = await route_context.params;
    const input = update_transaction_schema.parse(await read_json_body(request));

    return update_transaction(context.workspace.id, transaction_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { transaction_id } = await route_context.params;
    await delete_transaction(context.workspace.id, transaction_id);

    return { deleted: true };
  });
