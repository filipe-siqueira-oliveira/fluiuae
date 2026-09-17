import type { MemberDto, InvitationDto } from "@/types/api";
import type { MemberWithUser } from "@/server/services/member_query";
import type { WorkspaceInvitation } from "@fluiuae/database";

export const to_member_dto = (member: MemberWithUser): MemberDto => ({
  id: member.id,
  role: member.role,
  created_at: member.created_at.toISOString(),
  user: {
    id: member.user.id,
    name: member.user.name,
    email: member.user.email,
    phone: member.user.phone,
  },
});

export const to_invitation_dto = (invitation: WorkspaceInvitation): InvitationDto => ({
  id: invitation.id,
  email: invitation.email,
  role: invitation.role,
  status: invitation.status,
  expires_at: invitation.expires_at.toISOString(),
  created_at: invitation.created_at.toISOString(),
});
