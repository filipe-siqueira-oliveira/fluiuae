import { prisma_client } from "@fluiuae/database";
import { read_session_cookie } from "@/lib/session_cookie";
import { unauthorized } from "@/lib/http_error";
import type { AuthenticatedContext } from "@/types/session";

export const find_authenticated_context = async (): Promise<AuthenticatedContext | null> => {
  const session = await read_session_cookie();

  if (!session) {
    return null;
  }

  const membership = await prisma_client.workspaceMember.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: session.workspace_id,
        user_id: session.user_id,
      },
    },
    include: {
      user: true,
      workspace: true,
    },
  });

  if (!membership) {
    return null;
  }

  return {
    user: {
      id: membership.user.id,
      name: membership.user.name,
      email: membership.user.email,
      phone: membership.user.phone,
      completed_tours: membership.user.completed_tours,
    },
    workspace: {
      id: membership.workspace.id,
      name: membership.workspace.name,
    },
    role: membership.role,
  };
};

export const require_authenticated_context = async (): Promise<AuthenticatedContext> => {
  const context = await find_authenticated_context();

  if (!context) {
    throw unauthorized("session_not_found");
  }

  return context;
};
