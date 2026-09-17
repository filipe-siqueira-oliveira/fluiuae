import { handle_route, read_json_body } from "@/lib/route_handler";
import { require_authenticated_context } from "@/server/authorization/authenticated_context";
import { assert_can_manage_workspace } from "@/server/authorization/member_permissions";
import { read_profile, rename_workspace } from "@/server/services/profile_service";
import { rename_workspace_schema } from "@/validation/profile_schemas";

export const PATCH = async (request: Request) =>
  handle_route(async () => {
    const context = await require_authenticated_context();
    assert_can_manage_workspace(context.role);
    await rename_workspace(context.workspace.id, rename_workspace_schema.parse(await read_json_body(request)));

    return read_profile(context.user.id, context.workspace.id);
  });
