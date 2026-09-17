import type { WhatsappSession } from "@fluiuae/database";
import { WhatsappSessionStatus } from "@fluiuae/database";
import type { WhatsappSessionDto } from "@/types/api";
import { serialize_date } from "./decimal_serializer";

export const to_whatsapp_session_dto = (
  session: WhatsappSession | null
): WhatsappSessionDto => ({
  status: session?.status ?? WhatsappSessionStatus.DISCONNECTED,
  phone_number: session?.phone_number ?? null,
  qr_code: session?.qr_code ?? null,
  last_connected_at: serialize_date(session?.last_connected_at),
  last_error: session?.last_error ?? null,
});
