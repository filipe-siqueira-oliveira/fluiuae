"use client";

import { useEffect } from "react";
import { Form, Input, Modal, Select } from "antd";
import { MemberRole } from "@fluiuae/database/enums";
import { assignable_role_options } from "../helpers/role_labels";
import type { InvitePayload } from "../api/members_api";

type InviteMemberModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  on_cancel: () => void;
  on_submit: (payload: InvitePayload) => void;
};

export const InviteMemberModal = ({
  is_open,
  is_submitting,
  on_cancel,
  on_submit,
}: InviteMemberModalProps) => {
  const [form] = Form.useForm<InvitePayload>();

  useEffect(() => {
    if (is_open) {
      form.setFieldsValue({ email: "", role: MemberRole.ADMIN });
    }
  }, [form, is_open]);

  return (
    <Modal
      open={is_open}
      title="Convidar ajudante"
      okText="Enviar convite"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={on_submit} requiredMark={false}>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[{ required: true, type: "email", message: "Informe um e-mail válido" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Papel" rules={[{ required: true }]}>
          <Select options={assignable_role_options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
