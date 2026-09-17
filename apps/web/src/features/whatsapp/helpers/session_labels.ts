import { WhatsappSessionStatus } from "@fluiuae/database/enums";

const session_status_labels: Record<WhatsappSessionStatus, string> = {
  [WhatsappSessionStatus.DISCONNECTED]: "Desconectado",
  [WhatsappSessionStatus.AWAITING_QR_SCAN]: "Aguardando leitura do QR Code",
  [WhatsappSessionStatus.CONNECTED]: "Conectado",
  [WhatsappSessionStatus.EXPIRED]: "Sessão expirada",
};

const session_status_colors: Record<WhatsappSessionStatus, string> = {
  [WhatsappSessionStatus.DISCONNECTED]: "default",
  [WhatsappSessionStatus.AWAITING_QR_SCAN]: "gold",
  [WhatsappSessionStatus.CONNECTED]: "green",
  [WhatsappSessionStatus.EXPIRED]: "volcano",
};

export const translate_session_status = (status: WhatsappSessionStatus): string =>
  session_status_labels[status];

export const color_for_session_status = (status: WhatsappSessionStatus): string =>
  session_status_colors[status];
