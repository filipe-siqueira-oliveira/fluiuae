import express from "express";
import { require_worker_token } from "./authentication_middleware";
import { message_routes } from "./message_routes";
import { session_routes } from "./session_routes";

export const build_worker_server = () => {
  const application = express();

  application.use(express.json());
  application.get("/health", (_request, response) => response.json({ data: { status: "ok" } }));
  application.use("/sessions", require_worker_token, session_routes);
  application.use("/messages", require_worker_token, message_routes);

  return application;
};
