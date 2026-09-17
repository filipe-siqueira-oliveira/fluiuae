import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { summarize_credit_card_commitments } from "@/server/services/credit_card_commitments_service";

type RouteContext = { params: Promise<{ credit_card_id: string }> };

export const GET = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const { credit_card_id } = await route_context.params;

    return summarize_credit_card_commitments(context.workspace.id, credit_card_id);
  });
