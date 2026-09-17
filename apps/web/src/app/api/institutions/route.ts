import { handle_route } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { list_institutions } from "@/server/institutions/institution_catalog";

const one_day_in_seconds = 86400;

export const GET = async () => {
  const response = await handle_route(async () => {
    await require_authenticated_context();

    return list_institutions();
  });

  if (response.ok) {
    response.headers.set("cache-control", `private, max-age=${one_day_in_seconds}`);
  }

  return response;
};
