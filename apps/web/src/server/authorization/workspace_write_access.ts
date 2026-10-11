import { prisma_client } from "@fluiuae/database";
import { forbidden } from "@/lib/http_error";
import { assert_can_write_data } from "./member_permissions";

export const assert_user_can_write_workspace = async (user_id: string, workspace_id: string): Promise<void> => {
  const membership = await prisma_client.workspaceMember.findUnique({
    where: { workspace_id_user_id: { workspace_id, user_id } },
    select: { role: true },
  });

  if (!membership) {
    throw forbidden("user_not_member_of_workspace");
  }

  assert_can_write_data(membership.role);
};
