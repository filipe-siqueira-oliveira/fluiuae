import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { change_password } from "@/server/services/profile_service";
import { change_password_schema } from "@/validation/profile_schemas";

export const PUT = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    await change_password(context.user.id, change_password_schema.parse(await read_json_body(request)));

    return { changed: true };
  });
