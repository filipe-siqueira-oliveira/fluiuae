import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { read_profile, update_email } from "@/server/services/profile_service";
import { update_email_schema } from "@/validation/profile_schemas";

export const PUT = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    await update_email(context.user.id, update_email_schema.parse(await read_json_body(request)));

    return read_profile(context.user.id, context.workspace.id);
  });
