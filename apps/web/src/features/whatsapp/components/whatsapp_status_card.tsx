"use client";

import { Alert, Button, Descriptions, Space, Tag } from "antd";
import { Link2, Unlink } from "lucide-react";
import { WhatsappSessionStatus } from "@fluiuae/database/enums";
import { format_date } from "@/lib/date_formatter";
import { color_for_session_status, translate_session_status } from "../helpers/session_labels";
import type { WhatsappSessionDto } from "@/types/api";

type WhatsappStatusCardProps = {
  session: WhatsappSessionDto;
  is_busy: boolean;
  on_connect: () => void;
  on_disconnect: () => void;
};

export const WhatsappStatusCard = ({
  session,
  is_busy,
  on_connect,
  on_disconnect,
}: WhatsappStatusCardProps) => {
  const is_connected = session.status === WhatsappSessionStatus.CONNECTED;

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Descriptions column={1} size="small" bordered>
        <Descriptions.Item label="Situação">
          <Tag color={color_for_session_status(session.status)}>
            {translate_session_status(session.status)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Número">{session.phone_number ?? "-"}</Descriptions.Item>
        <Descriptions.Item label="Última conexão">
          {format_date(session.last_connected_at)}
        </Descriptions.Item>
      </Descriptions>
      {session.last_error ? (
        <Alert type="warning" message="Último erro" description={session.last_error} />
      ) : null}
      <Space wrap>
        <Button
          type="primary"
          icon={<Link2 size={16} />}
          loading={is_busy}
          disabled={is_connected}
          onClick={on_connect}
        >
          Conectar WhatsApp
        </Button>
        <Button
          danger
          icon={<Unlink size={16} />}
          loading={is_busy}
          disabled={session.status === WhatsappSessionStatus.DISCONNECTED}
          onClick={on_disconnect}
        >
          Desconectar
        </Button>
      </Space>
    </Space>
  );
};
