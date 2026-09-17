import { handle_route, read_json_body, read_search_params } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { generate_due_scheduled_transactions } from "@/server/services/scheduled_transaction_generator";
import {
  create_transaction,
  list_transactions,
  summarize_transactions,
} from "@/server/services/transaction_service";
import {
  create_transaction_schema,
  list_transactions_query_schema,
} from "@/validation/transaction_schemas";

export const GET = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const query = list_transactions_query_schema.parse(read_search_params(request));

    await generate_due_scheduled_transactions(
      context.workspace.id,
      query.end_date ? new Date(query.end_date) : null
    );

    const [transactions, summary] = await Promise.all([
      list_transactions(context.workspace.id, query),
      summarize_transactions(context.workspace.id, query),
    ]);

    return { transactions, summary };
  });

export const POST = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const input = create_transaction_schema.parse(await read_json_body(request));

    return create_transaction(context.workspace.id, context.user.id, input);
  }, 201);
