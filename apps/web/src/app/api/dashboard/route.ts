import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { build_dashboard } from "@/server/services/dashboard_service";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return build_dashboard(context.workspace.id, context.user.id);
  });
