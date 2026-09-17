import { z } from "zod";
import { prisma_client } from "@fluiuae/database";
import { handle_route, read_json_body } from "@/lib/route_handler";
import { dashboard_widget_keys, sanitize_dashboard_widgets } from "@/lib/dashboard_widgets";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";

const preferences_schema = z.object({ widgets: z.array(z.enum(dashboard_widget_keys)) });

export const PUT = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    const widgets = sanitize_dashboard_widgets(preferences_schema.parse(await read_json_body(request)).widgets);

    await prisma_client.user.update({ where: { id: context.user.id }, data: { dashboard_widgets: widgets } });

    return { widgets };
  });
