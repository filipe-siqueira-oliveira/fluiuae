"use client";

import { Form, Input, Modal } from "antd";
import type { EmailPayload } from "../api/settings_api";

type EmailChangeModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  current_email: string;
  on_cancel: () => void;
  on_submit: (payload: EmailPayload) => void;
};

export const EmailChangeModal = ({ is_open, is_submitting, current_email, on_cancel, on_submit }: EmailChangeModalProps) => {
  const [form] = Form.useForm<EmailPayload>();

  return (
    <Modal
      open={is_open}
      title="Alterar e-mail"
      okText="Salvar e-mail"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark={false} preserve={false} onFinish={on_submit}>
        <Form.Item
          name="email"
          label="Novo e-mail"
          extra={`Hoje você entra com ${current_email}.`}
          rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
        >
          <Input autoComplete="email" />
        </Form.Item>
        <Form.Item
          name="current_password"
          label="Senha atual"
          rules={[{ required: true, message: "Confirme com sua senha atual" }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
