import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { delete_credit_card, update_credit_card } from "@/server/services/credit_card_service";
import { update_credit_card_schema } from "@/validation/credit_card_schemas";

type RouteContext = { params: Promise<{ credit_card_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { credit_card_id } = await route_context.params;
    const input = update_credit_card_schema.parse(await read_json_body(request));

    return update_credit_card(context.workspace.id, credit_card_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { credit_card_id } = await route_context.params;
    await delete_credit_card(context.workspace.id, credit_card_id);

    return { deleted: true };
  });
