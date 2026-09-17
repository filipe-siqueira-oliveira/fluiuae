import { prisma_client } from "@fluiuae/database";
import { bad_request } from "@/lib/http_error";
import { product_tours } from "@/lib/product_tours";
import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";

type RouteContext = { params: Promise<{ tour_key: string }> };

export const POST = async (_request: Request, route_context: RouteContext) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const { tour_key } = await route_context.params;

    if (!product_tours.some((tour) => tour.key === tour_key)) {
      throw bad_request("unknown_tour");
    }

    const user = await prisma_client.user.findUniqueOrThrow({
      where: { id: context.user.id },
      select: { completed_tours: true },
    });

    if (!user.completed_tours.includes(tour_key)) {
      await prisma_client.user.update({
        where: { id: context.user.id },
        data: { completed_tours: { push: tour_key } },
      });
    }

    return { tour_key };
  });
