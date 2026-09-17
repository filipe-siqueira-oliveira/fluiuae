import axios from "axios";
import { environment } from "@/lib/environment";

const build_worker_client = () =>
  axios.create({
    baseURL: environment.whatsapp_worker_url(),
    timeout: 10000,
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${environment.whatsapp_worker_token()}`,
    },
  });

export const request_worker_connection = async (user_id: string): Promise<void> => {
  await build_worker_client().post("/sessions/connect", { user_id });
};

export const request_worker_disconnection = async (user_id: string): Promise<void> => {
  await build_worker_client().post("/sessions/disconnect", { user_id });
};

export const request_worker_message = async (input: {
  user_id: string;
  recipient: string;
  text: string;
}): Promise<void> => {
  await build_worker_client().post("/messages/send", input);
};
