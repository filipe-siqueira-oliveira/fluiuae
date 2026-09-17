import { InvitationStatus, prisma_client } from "@fluiuae/database";
import { hash_password, verify_password } from "@/lib/password_hasher";
import { conflict, unauthorized } from "@/lib/http_error";
import { create_workspace_with_defaults } from "./workspace_service";
import type { LoginInput, RegisterInput } from "@/validation/auth_schemas";
import type { SessionPayload } from "@/types/session";

const default_workspace_name = "Minhas Finanças";

const accept_pending_invitations = async (
  transaction_client: Parameters<typeof create_workspace_with_defaults>[0],
  input: { user_id: string; email: string }
) => {
  const pending_invitations = await transaction_client.workspaceInvitation.findMany({
    where: {
      email: input.email,
      status: InvitationStatus.PENDING,
      expires_at: { gt: new Date() },
    },
  });

  for (const invitation of pending_invitations) {
    await transaction_client.workspaceMember.upsert({
      where: {
        workspace_id_user_id: {
          workspace_id: invitation.workspace_id,
          user_id: input.user_id,
        },
      },
      create: {
        workspace_id: invitation.workspace_id,
        user_id: input.user_id,
        role: invitation.role,
      },
      update: {
        role: invitation.role,
      },
    });

    await transaction_client.workspaceInvitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED, accepted_at: new Date() },
    });
  }
};

export const register_user = async (input: RegisterInput): Promise<SessionPayload> => {
  const existing_user = await prisma_client.user.findUnique({ where: { email: input.email } });

  if (existing_user) {
    throw conflict("email_already_registered");
  }

  const password_hash = await hash_password(input.password);

  return prisma_client.$transaction(async (transaction_client) => {
    const user = await transaction_client.user.create({
      data: {
        name: input.name,
        email: input.email,
        password_hash,
      },
    });

    const workspace = await create_workspace_with_defaults(transaction_client, {
      owner_id: user.id,
      name: default_workspace_name,
    });

    await accept_pending_invitations(transaction_client, { user_id: user.id, email: user.email });

    const membership = await transaction_client.workspaceMember.findUniqueOrThrow({
      where: {
        workspace_id_user_id: { workspace_id: workspace.id, user_id: user.id },
      },
    });

    return {
      user_id: user.id,
      workspace_id: workspace.id,
      role: membership.role,
    };
  });
};

export const authenticate_user = async (input: LoginInput): Promise<SessionPayload> => {
  const user = await prisma_client.user.findUnique({
    where: { email: input.email },
    include: {
      memberships: {
        orderBy: { created_at: "asc" },
      },
    },
  });

  if (!user) {
    throw unauthorized("invalid_credentials");
  }

  const password_matches = await verify_password(input.password, user.password_hash);

  if (!password_matches) {
    throw unauthorized("invalid_credentials");
  }

  const membership = user.memberships[0];

  if (!membership) {
    throw unauthorized("user_without_workspace");
  }

  return {
    user_id: user.id,
    workspace_id: membership.workspace_id,
    role: membership.role,
  };
};
