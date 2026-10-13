import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { undo_credit_card_statement_payment } from "@/server/services/credit_card_statement_payment_service";
import {
  statement_key_schema,
  statement_payment_id_schema,
} from "@/validation/credit_card_statement_payment_schemas";

type RouteContext = { params: Promise<{ credit_card_id: string; statement_key: string; transaction_id: string }> };

export const DELETE = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { credit_card_id, statement_key, transaction_id } = await route_context.params;

    await undo_credit_card_statement_payment(
      context.workspace.id,
      credit_card_id,
      statement_key_schema.parse(statement_key),
      statement_payment_id_schema.parse(transaction_id)
    );

    return { statement_key, transaction_id };
  });
