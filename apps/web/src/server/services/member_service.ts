import { MemberRole, prisma_client } from "@fluiuae/database";
import { conflict, not_found } from "@/lib/http_error";
import { to_member_dto } from "@/server/mappers/member_mapper";
import { member_include } from "./member_query";
import type { MemberDto } from "@/types/api";
import type { UpdateMemberInput } from "@/validation/member_schemas";

export const list_members = async (workspace_id: string): Promise<MemberDto[]> => {
  const members = await prisma_client.workspaceMember.findMany({
    where: { workspace_id },
    include: member_include,
    orderBy: { created_at: "asc" },
  });

  return members.map(to_member_dto);
};

export const update_member_role = async (
  workspace_id: string,
  member_id: string,
  input: UpdateMemberInput
): Promise<MemberDto> => {
  const existing_member = await prisma_client.workspaceMember.findFirst({
    where: { id: member_id, workspace_id },
  });

  if (!existing_member) {
    throw not_found("member_not_found");
  }

  if (existing_member.role === MemberRole.OWNER) {
    throw conflict("owner_role_cannot_change");
  }

  const member = await prisma_client.workspaceMember.update({
    where: { id: member_id },
    data: { role: input.role },
    include: member_include,
  });

  return to_member_dto(member);
};

export const remove_member = async (workspace_id: string, member_id: string): Promise<void> => {
  const existing_member = await prisma_client.workspaceMember.findFirst({
    where: { id: member_id, workspace_id },
  });

  if (!existing_member) {
    throw not_found("member_not_found");
  }

  if (existing_member.role === MemberRole.OWNER) {
    throw conflict("owner_cannot_be_removed");
  }

  await prisma_client.workspaceMember.delete({ where: { id: member_id } });
};
