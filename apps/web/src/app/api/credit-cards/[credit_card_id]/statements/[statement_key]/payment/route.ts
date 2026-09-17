import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import {
  pay_credit_card_statement,
  undo_credit_card_statement_payment,
} from "@/server/services/credit_card_statement_payment_service";
import {
  pay_credit_card_statement_schema,
  statement_key_schema,
} from "@/validation/credit_card_statement_payment_schemas";

type RouteContext = { params: Promise<{ credit_card_id: string; statement_key: string }> };

export const POST = async (request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { credit_card_id, statement_key } = await route_context.params;
    const input = pay_credit_card_statement_schema.parse(await read_json_body(request));

    await pay_credit_card_statement(
      context.workspace.id,
      context.user.id,
      credit_card_id,
      statement_key_schema.parse(statement_key),
      input
    );

    return { statement_key, status: "PAID" };
  });

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { credit_card_id, statement_key } = await route_context.params;

    await undo_credit_card_statement_payment(
      context.workspace.id,
      credit_card_id,
      statement_key_schema.parse(statement_key)
    );

    return { statement_key, status: "PENDING" };
  });
