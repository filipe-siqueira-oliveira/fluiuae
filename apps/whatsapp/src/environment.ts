import { load_root_environment } from "@fluiuae/database";

load_root_environment();

export const environment = {
  worker_port: Number(process.env.WHATSAPP_WORKER_PORT ?? 4000),
  worker_token: process.env.WHATSAPP_WORKER_TOKEN ?? "",
};
