import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_members } from "@/server/services/member_service";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return list_members(context.workspace.id);
  });
