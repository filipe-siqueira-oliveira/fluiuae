import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { create_shared_purchase } from "@/server/services/shared_purchase_service";
import { create_shared_purchase_schema } from "@/validation/shared_purchase_schemas";

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const input = create_shared_purchase_schema.parse(await read_json_body(request));

    return create_shared_purchase(context.user.id, input);
  }, 201);
