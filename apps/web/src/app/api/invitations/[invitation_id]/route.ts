import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_manage_members } from "@/server/authorization/member_permissions";
import { revoke_invitation } from "@/server/services/invitation_service";

type RouteContext = { params: Promise<{ invitation_id: string }> };

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_members(context.role);

    const { invitation_id } = await route_context.params;
    await revoke_invitation(context.workspace.id, invitation_id);

    return { revoked: true };
  });
