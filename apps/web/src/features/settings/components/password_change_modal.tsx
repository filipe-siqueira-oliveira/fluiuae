"use client";

import { Form, Input, Modal } from "antd";
import type { PasswordPayload } from "../api/settings_api";

type PasswordFormValues = PasswordPayload & { confirmation: string };

type PasswordChangeModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  on_cancel: () => void;
  on_submit: (payload: PasswordPayload) => void;
};

export const PasswordChangeModal = ({ is_open, is_submitting, on_cancel, on_submit }: PasswordChangeModalProps) => {
  const [form] = Form.useForm<PasswordFormValues>();

  return (
    <Modal
      open={is_open}
      title="Alterar senha"
      okText="Salvar senha"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        preserve={false}
        onFinish={(values) => on_submit({ current_password: values.current_password, new_password: values.new_password })}
      >
        <Form.Item name="current_password" label="Senha atual" rules={[{ required: true, message: "Informe a senha atual" }]}>
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="new_password"
          label="Nova senha"
          rules={[{ required: true, min: 8, message: "A nova senha precisa ter ao menos 8 caracteres" }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmation"
          label="Repita a nova senha"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Repita a nova senha" },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || value === getFieldValue("new_password")
                  ? Promise.resolve()
                  : Promise.reject(new Error("As senhas não são iguais")),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
