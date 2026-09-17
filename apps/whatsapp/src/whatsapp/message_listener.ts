import type { WASocket } from "@whiskeysockets/baileys";
import { logger } from "../logger";

export const register_message_listener = (user_id: string, socket: WASocket): void => {
  socket.ev.on("messages.upsert", (event) => {
    if (event.type !== "notify") {
      return;
    }

    for (const message of event.messages) {
      if (message.key.fromMe) {
        continue;
      }

      logger.debug(
        { user_id, remote_jid: message.key.remoteJid },
        "incoming_message_received"
      );
    }
  });
};
