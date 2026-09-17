import { randomUUID } from "node:crypto";
import { InvitationStatus, prisma_client } from "@fluiuae/database";
import { conflict, not_found } from "@/lib/http_error";
import { to_invitation_dto } from "@/server/mappers/member_mapper";
import { on_member_joined } from "./member_joined_hook";
import type { InvitationDto } from "@/types/api";
import type { CreateInvitationInput } from "@/validation/member_schemas";

const invitation_lifetime_days = 7;

const build_expiration_date = (): Date => {
  const expiration_date = new Date();
  expiration_date.setDate(expiration_date.getDate() + invitation_lifetime_days);

  return expiration_date;
};

export const list_invitations = async (workspace_id: string): Promise<InvitationDto[]> => {
  const invitations = await prisma_client.workspaceInvitation.findMany({
    where: { workspace_id, status: InvitationStatus.PENDING },
    orderBy: { created_at: "desc" },
  });

  return invitations.map(to_invitation_dto);
};

export const create_invitation = async (
  workspace_id: string,
  invited_by_id: string,
  input: CreateInvitationInput
): Promise<{ invitation: InvitationDto | null; joined_immediately: boolean }> => {
  const existing_user = await prisma_client.user.findUnique({ where: { email: input.email } });

  if (existing_user) {
    const existing_member = await prisma_client.workspaceMember.findUnique({
      where: { workspace_id_user_id: { workspace_id, user_id: existing_user.id } },
    });

    if (existing_member) {
      throw conflict("user_already_member");
    }

    await prisma_client.workspaceMember.create({
      data: { workspace_id, user_id: existing_user.id, role: input.role },
    });

    await on_member_joined({
      workspace_id,
      owner_id: invited_by_id,
      member_user_id: existing_user.id,
    });

    return { invitation: null, joined_immediately: true };
  }

  const pending_invitation = await prisma_client.workspaceInvitation.findFirst({
    where: { workspace_id, email: input.email, status: InvitationStatus.PENDING },
  });

  if (pending_invitation) {
    throw conflict("invitation_already_pending");
  }

  const invitation = await prisma_client.workspaceInvitation.create({
    data: {
      workspace_id,
      invited_by_id,
      email: input.email,
      role: input.role,
      token: randomUUID(),
      expires_at: build_expiration_date(),
    },
  });

  return { invitation: to_invitation_dto(invitation), joined_immediately: false };
};

export const revoke_invitation = async (
  workspace_id: string,
  invitation_id: string
): Promise<void> => {
  const existing_invitation = await prisma_client.workspaceInvitation.findFirst({
    where: { id: invitation_id, workspace_id },
  });

  if (!existing_invitation) {
    throw not_found("invitation_not_found");
  }

  await prisma_client.workspaceInvitation.update({
    where: { id: invitation_id },
    data: { status: InvitationStatus.REVOKED },
  });
};
