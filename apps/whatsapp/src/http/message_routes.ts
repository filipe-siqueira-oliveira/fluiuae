import { Router } from "express";
import { send_text_message } from "../whatsapp/session_manager";
import { logger } from "../logger";

export const message_routes = Router();

message_routes.post("/send", async (request, response) => {
  const { user_id, recipient, text } = request.body as {
    user_id?: string;
    recipient?: string;
    text?: string;
  };

  if (!user_id || !recipient || !text) {
    response.status(400).json({ error: "user_id_recipient_and_text_required" });

    return;
  }

  try {
    await send_text_message({ user_id, recipient, text });
    response.json({ data: { sent: true } });
  } catch (error) {
    logger.error({ error }, "send_message_failed");
    response.status(500).json({ error: "send_message_failed" });
  }
});
