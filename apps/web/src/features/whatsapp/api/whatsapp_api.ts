import { http_client, unwrap_response } from "@/lib/http_client";
import type { WhatsappSessionDto } from "@/types/api";

export const fetch_whatsapp_session = async (): Promise<WhatsappSessionDto> => {
  const response = await http_client.get("/whatsapp/session");

  return unwrap_response(response.data);
};

export const connect_whatsapp_request = async (): Promise<WhatsappSessionDto> => {
  const response = await http_client.post("/whatsapp/session");

  return unwrap_response(response.data);
};

export const disconnect_whatsapp_request = async (): Promise<WhatsappSessionDto> => {
  const response = await http_client.delete("/whatsapp/session");

  return unwrap_response(response.data);
};
