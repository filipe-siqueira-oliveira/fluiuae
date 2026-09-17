import { WhatsappSessionStatus, prisma_client } from "@fluiuae/database";
import { to_whatsapp_session_dto } from "@/server/mappers/whatsapp_session_mapper";
import { request_worker_connection, request_worker_disconnection } from "./whatsapp_worker_client";
import type { WhatsappSessionDto } from "@/types/api";

const describe_worker_failure = (error: unknown): string =>
  error instanceof Error ? error.message : "whatsapp_worker_unreachable";

export const read_whatsapp_session = async (user_id: string): Promise<WhatsappSessionDto> => {
  const session = await prisma_client.whatsappSession.findUnique({ where: { user_id } });

  return to_whatsapp_session_dto(session);
};

export const start_whatsapp_session = async (user_id: string): Promise<WhatsappSessionDto> => {
  await prisma_client.whatsappSession.upsert({
    where: { user_id },
    create: { user_id, status: WhatsappSessionStatus.AWAITING_QR_SCAN },
    update: { status: WhatsappSessionStatus.AWAITING_QR_SCAN, qr_code: null, last_error: null },
  });

  try {
    await request_worker_connection(user_id);
  } catch (error) {
    const session = await prisma_client.whatsappSession.update({
      where: { user_id },
      data: {
        status: WhatsappSessionStatus.DISCONNECTED,
        last_error: describe_worker_failure(error),
      },
    });

    return to_whatsapp_session_dto(session);
  }

  return read_whatsapp_session(user_id);
};

export const stop_whatsapp_session = async (user_id: string): Promise<WhatsappSessionDto> => {
  try {
    await request_worker_disconnection(user_id);
  } catch (error) {
    await prisma_client.whatsappSession.updateMany({
      where: { user_id },
      data: { last_error: describe_worker_failure(error) },
    });
  }

  await prisma_client.whatsappSession.updateMany({
    where: { user_id },
    data: {
      status: WhatsappSessionStatus.DISCONNECTED,
      qr_code: null,
      credentials: undefined,
      signal_keys: undefined,
    },
  });

  return read_whatsapp_session(user_id);
};
