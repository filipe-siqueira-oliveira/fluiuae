import { handle_route, read_json_body, read_search_params } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import {
  create_fixed_transaction,
  list_fixed_transactions,
} from "@/server/services/fixed_transaction_service";
import {
  create_fixed_transaction_schema,
  list_fixed_transactions_query_schema,
} from "@/validation/fixed_transaction_schemas";

export const GET = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const query = list_fixed_transactions_query_schema.parse(read_search_params(request));

    return list_fixed_transactions(context.workspace.id, query.type);
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = create_fixed_transaction_schema.parse(await read_json_body(request));

    return create_fixed_transaction(context.workspace.id, context.user.id, input);
  }, 201);
