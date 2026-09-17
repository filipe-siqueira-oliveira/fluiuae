import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_manage_members } from "@/server/authorization/member_permissions";
import { remove_member, update_member_role } from "@/server/services/member_service";
import { update_member_schema } from "@/validation/member_schemas";

type RouteContext = { params: Promise<{ member_id: string }> };

export const PATCH = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_members(context.role);

    const { member_id } = await route_context.params;
    const input = update_member_schema.parse(await read_json_body(request));

    return update_member_role(context.workspace.id, member_id, input);
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_members(context.role);

    const { member_id } = await route_context.params;
    await remove_member(context.workspace.id, member_id);

    return { removed: true };
  });
