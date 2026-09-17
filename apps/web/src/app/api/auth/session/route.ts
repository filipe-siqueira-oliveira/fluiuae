import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";

export const GET = async () => handle_route(() => require_authenticated_context());
