import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import {
  delete_recurring_charge,
  update_recurring_charge,
} from "@/server/services/recurring_charge_service";
import { update_recurring_charge_schema } from "@/validation/recurring_charge_schemas";

type RouteContext = { params: Promise<{ recurring_charge_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { recurring_charge_id } = await route_context.params;
    const input = update_recurring_charge_schema.parse(await read_json_body(request));

    return update_recurring_charge(context.workspace.id, recurring_charge_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { recurring_charge_id } = await route_context.params;
    await delete_recurring_charge(context.workspace.id, recurring_charge_id);

    return { deleted: true };
  });
