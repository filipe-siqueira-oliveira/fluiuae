import { prisma_client } from "@fluiuae/database";
import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";

export const DELETE = async () =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    await prisma_client.user.update({ where: { id: context.user.id }, data: { completed_tours: [] } });

    return { reset: true };
  });
