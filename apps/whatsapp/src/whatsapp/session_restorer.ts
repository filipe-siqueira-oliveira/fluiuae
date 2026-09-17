import { WhatsappSessionStatus, prisma_client } from "@fluiuae/database";
import { logger } from "../logger";
import { connect_session } from "./session_manager";

export const restore_active_sessions = async (): Promise<void> => {
  const stored_sessions = await prisma_client.whatsappSession.findMany({
    where: { status: WhatsappSessionStatus.CONNECTED },
    select: { user_id: true },
  });

  for (const session of stored_sessions) {
    try {
      await connect_session(session.user_id);
    } catch (error) {
      logger.error({ error, user_id: session.user_id }, "restore_session_failed");
    }
  }
};
