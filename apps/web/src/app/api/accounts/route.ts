import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { create_account, list_accounts } from "@/server/services/account_service";
import { create_account_schema } from "@/validation/account_schemas";

export const GET = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();

    return list_accounts(context.workspace.id);
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = create_account_schema.parse(await read_json_body(request));

    return create_account(context.workspace.id, input);
  }, 201);
