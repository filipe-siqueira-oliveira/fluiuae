"use client";

import { Alert, Space, Typography } from "antd";

type WhatsappQrCodeProps = {
  qr_code: string | null;
};

export const WhatsappQrCode = ({ qr_code }: WhatsappQrCodeProps) => {
  if (!qr_code) {
    return (
      <Alert
        type="info"
        message="Gerando QR Code"
        description="Assim que o worker do WhatsApp responder, o código aparece aqui."
      />
    );
  }

  return (
    <Space direction="vertical">
      <Typography.Text>
        Abra o WhatsApp no celular, vá em Aparelhos conectados e leia o código abaixo.
      </Typography.Text>
      <img src={qr_code} alt="QR Code do WhatsApp" width={264} height={264} />
    </Space>
  );
};
