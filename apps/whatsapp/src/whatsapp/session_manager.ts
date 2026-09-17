import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  type WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { WhatsappSessionStatus } from "@fluiuae/database";
import { logger } from "../logger";
import { create_prisma_auth_state, clear_prisma_auth_state } from "./prisma_auth_state";
import { render_qr_code_as_data_url } from "./qr_code_renderer";
import { register_message_listener } from "./message_listener";
import { write_session_status } from "./session_status_writer";

const active_sockets = new Map<string, WASocket>();

const extract_phone_number = (socket: WASocket): string | null => {
  const jid = socket.user?.id;

  return jid ? jid.split(":")[0] : null;
};

const handle_connection_close = async (user_id: string, error: unknown): Promise<void> => {
  const status_code = (error as Boom)?.output?.statusCode;
  const was_logged_out = status_code === DisconnectReason.loggedOut;

  active_sockets.delete(user_id);

  if (was_logged_out) {
    await clear_prisma_auth_state(user_id);
    await write_session_status(user_id, {
      status: WhatsappSessionStatus.EXPIRED,
      qr_code: null,
      last_error: "logged_out",
    });

    return;
  }

  await write_session_status(user_id, {
    status: WhatsappSessionStatus.DISCONNECTED,
    qr_code: null,
  });

  await connect_session(user_id);
};

export const connect_session = async (user_id: string): Promise<void> => {
  if (active_sockets.has(user_id)) {
    return;
  }

  const { state, persist_state } = await create_prisma_auth_state(user_id);
  const { version } = await fetchLatestBaileysVersion();

  const socket = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
  });

  active_sockets.set(user_id, socket);

  socket.ev.on("creds.update", persist_state);

  socket.ev.on("connection.update", async (update) => {
    const { connection, qr, lastDisconnect } = update;

    if (qr) {
      await write_session_status(user_id, {
        status: WhatsappSessionStatus.AWAITING_QR_SCAN,
        qr_code: await render_qr_code_as_data_url(qr),
      });
    }

    if (connection === "open") {
      await write_session_status(user_id, {
        status: WhatsappSessionStatus.CONNECTED,
        qr_code: null,
        last_error: null,
        last_connected_at: new Date(),
        phone_number: extract_phone_number(socket),
      });

      logger.info({ user_id }, "whatsapp_session_connected");
    }

    if (connection === "close") {
      await handle_connection_close(user_id, lastDisconnect?.error);
    }
  });

  register_message_listener(user_id, socket);
};

export const disconnect_session = async (user_id: string): Promise<void> => {
  const socket = active_sockets.get(user_id);

  if (socket) {
    await socket.logout().catch(() => socket.end(undefined));
    active_sockets.delete(user_id);
  }

  await clear_prisma_auth_state(user_id);
  await write_session_status(user_id, {
    status: WhatsappSessionStatus.DISCONNECTED,
    qr_code: null,
    phone_number: null,
  });
};

export const send_text_message = async (input: {
  user_id: string;
  recipient: string;
  text: string;
}): Promise<void> => {
  const socket = active_sockets.get(input.user_id);

  if (!socket) {
    throw new Error("session_not_connected");
  }

  await socket.sendMessage(input.recipient, { text: input.text });
};

export const build_self_jid = (phone_number: string): string =>
  `${phone_number.replace(/\D/g, "")}@s.whatsapp.net`;
