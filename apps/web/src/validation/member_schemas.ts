import { z } from "zod";
import { MemberRole } from "@fluiuae/database";

const assignable_role = z.enum([MemberRole.ADMIN, MemberRole.VIEWER]);

export const create_invitation_schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  role: assignable_role,
});

export const update_member_schema = z.object({
  role: assignable_role,
});

export type CreateInvitationInput = z.infer<typeof create_invitation_schema>;
export type UpdateMemberInput = z.infer<typeof update_member_schema>;
