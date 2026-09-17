import { handle_route } from "@/lib/route_handler";
import { write_session_cookie } from "@/lib/session_cookie";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { activate_workspace } from "@/server/services/workspace_access_service";

type RouteContext = { params: Promise<{ workspace_id: string }> };

export const POST = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const { workspace_id } = await route_context.params;
    const session = await activate_workspace(context.user.id, workspace_id);

    await write_session_cookie(session);

    return { workspace_id: session.workspace_id, role: session.role };
  });
