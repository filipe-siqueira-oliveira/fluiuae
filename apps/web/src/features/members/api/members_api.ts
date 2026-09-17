import { http_client, unwrap_response } from "@/lib/http_client";
import type { InvitationDto, MemberDto } from "@/types/api";
import type { MemberRole } from "@fluiuae/database/enums";

export type InvitePayload = {
  email: string;
  role: MemberRole;
};

export const fetch_members = async (): Promise<MemberDto[]> => {
  const response = await http_client.get("/members");

  return unwrap_response(response.data);
};

export const fetch_invitations = async (): Promise<InvitationDto[]> => {
  const response = await http_client.get("/invitations");

  return unwrap_response(response.data);
};

export const create_invitation_request = async (payload: InvitePayload): Promise<void> => {
  await http_client.post("/invitations", payload);
};

export const revoke_invitation_request = async (invitation_id: string): Promise<void> => {
  await http_client.delete(`/invitations/${invitation_id}`);
};

export const update_member_role_request = async (
  member_id: string,
  role: MemberRole
): Promise<void> => {
  await http_client.patch(`/members/${member_id}`, { role });
};

export const remove_member_request = async (member_id: string): Promise<void> => {
  await http_client.delete(`/members/${member_id}`);
};
