import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_manage_members } from "@/server/authorization/member_permissions";
import { create_invitation, list_invitations } from "@/server/services/invitation_service";
import { create_invitation_schema } from "@/validation/member_schemas";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_members(context.role);

    return list_invitations(context.workspace.id);
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_members(context.role);

    const input = create_invitation_schema.parse(await read_json_body(request));

    return create_invitation(context.workspace.id, context.user.id, input);
  }, 201);
