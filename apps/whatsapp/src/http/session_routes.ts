import { Router } from "express";
import { connect_session, disconnect_session } from "../whatsapp/session_manager";
import { logger } from "../logger";

export const session_routes = Router();

session_routes.post("/connect", async (request, response) => {
  const { user_id } = request.body as { user_id?: string };

  if (!user_id) {
    response.status(400).json({ error: "user_id_required" });

    return;
  }

  try {
    await connect_session(user_id);
    response.json({ data: { connecting: true } });
  } catch (error) {
    logger.error({ error }, "connect_session_failed");
    response.status(500).json({ error: "connect_session_failed" });
  }
});

session_routes.post("/disconnect", async (request, response) => {
  const { user_id } = request.body as { user_id?: string };

  if (!user_id) {
    response.status(400).json({ error: "user_id_required" });

    return;
  }

  try {
    await disconnect_session(user_id);
    response.json({ data: { disconnected: true } });
  } catch (error) {
    logger.error({ error }, "disconnect_session_failed");
    response.status(500).json({ error: "disconnect_session_failed" });
  }
});
