import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import {
  create_recurring_charge,
  list_recurring_charges,
} from "@/server/services/recurring_charge_service";
import { create_recurring_charge_schema } from "@/validation/recurring_charge_schemas";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return list_recurring_charges(context.workspace.id);
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = create_recurring_charge_schema.parse(await read_json_body(request));

    return create_recurring_charge(context.workspace.id, context.user.id, input);
  }, 201);
