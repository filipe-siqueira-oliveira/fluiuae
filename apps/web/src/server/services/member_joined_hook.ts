import { WhatsappSessionStatus, prisma_client } from "@fluiuae/database";

export const on_member_joined = async (input: {
  workspace_id: string;
  owner_id: string;
  member_user_id: string;
}): Promise<void> => {
  const [owner_session, member_user] = await Promise.all([
    prisma_client.whatsappSession.findUnique({ where: { user_id: input.owner_id } }),
    prisma_client.user.findUnique({ where: { id: input.member_user_id } }),
  ]);

  const owner_is_connected = owner_session?.status === WhatsappSessionStatus.CONNECTED;
  const member_has_phone = Boolean(member_user?.phone);

  if (!owner_is_connected || !member_has_phone) {
    return;
  }
};
