import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import {
  read_whatsapp_session,
  start_whatsapp_session,
  stop_whatsapp_session,
} from "@/server/services/whatsapp_service";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return read_whatsapp_session(context.user.id);
  });

export const POST = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return start_whatsapp_session(context.user.id);
  });

export const DELETE = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return stop_whatsapp_session(context.user.id);
  });
