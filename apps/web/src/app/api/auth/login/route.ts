import { handle_route, read_json_body } from "@/lib/route_handler";
import { write_session_cookie } from "@/lib/session_cookie";
import { authenticate_user } from "@/server/services/auth_service";
import { login_schema } from "@/validation/auth_schemas";

export const POST = async (request: Request) =>
  handle_route(async () => {
    const input = login_schema.parse(await read_json_body(request));
    const session = await authenticate_user(input);

    await write_session_cookie(session);

    return { workspace_id: session.workspace_id };
  });
