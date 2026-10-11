import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_workspace_payment_sources } from "@/server/services/workspace_payment_sources_service";

type RouteContext = { params: Promise<{ workspace_id: string }> };

export const GET = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const { workspace_id } = await route_context.params;

    return list_workspace_payment_sources(context.user.id, workspace_id);
  });
