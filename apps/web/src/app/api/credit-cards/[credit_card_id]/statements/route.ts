import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_credit_card_statements } from "@/server/services/credit_card_statement_service";

type RouteContext = { params: Promise<{ credit_card_id: string }> };

export const GET = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const { credit_card_id } = await route_context.params;

    return list_credit_card_statements(context.workspace.id, credit_card_id);
  });
