import type { Prisma } from "@fluiuae/database";

export const member_include = {
  user: { select: { id: true, name: true, email: true, phone: true } },
} satisfies Prisma.WorkspaceMemberInclude;

export type MemberWithUser = Prisma.WorkspaceMemberGetPayload<{
  include: typeof member_include;
}>;
