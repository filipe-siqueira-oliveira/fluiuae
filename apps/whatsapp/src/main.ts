import { environment } from "./environment";
import { build_worker_server } from "./http/build_worker_server";
import { logger } from "./logger";
import { restore_active_sessions } from "./whatsapp/session_restorer";

const start_worker = async () => {
  const application = build_worker_server();

  application.listen(environment.worker_port, () => {
    logger.info({ port: environment.worker_port }, "whatsapp_worker_started");
  });

  await restore_active_sessions();
};

void start_worker();
