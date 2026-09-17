import { handle_route } from "@/lib/route_handler";
import { clear_session_cookie } from "@/lib/session_cookie";

export const POST = async () =>
  handle_route(async () => {
    await clear_session_cookie();

    return { signed_out: true };
  });
