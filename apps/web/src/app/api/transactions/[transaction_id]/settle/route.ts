import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_write_data } from "@/server/authorization/member_permissions";
import { settle_transaction } from "@/server/services/transaction_service";

type RouteContext = { params: Promise<{ transaction_id: string }> };

export const POST = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_write_data(context.role);

    const { transaction_id } = await route_context.params;

    return settle_transaction(context.workspace.id, transaction_id);
  });
