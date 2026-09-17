import { WhatsappSessionStatus, prisma_client } from "@fluiuae/database";

export const write_session_status = async (
  user_id: string,
  data: {
    status?: WhatsappSessionStatus;
    qr_code?: string | null;
    phone_number?: string | null;
    last_error?: string | null;
    last_connected_at?: Date | null;
  }
): Promise<void> => {
  await prisma_client.whatsappSession.upsert({
    where: { user_id },
    create: { user_id, ...data },
    update: data,
  });
};
