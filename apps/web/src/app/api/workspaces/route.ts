import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_user_workspaces } from "@/server/services/workspace_access_service";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return list_user_workspaces(context.user.id);
  });
