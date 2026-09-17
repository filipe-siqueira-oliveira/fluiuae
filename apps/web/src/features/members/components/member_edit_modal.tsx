"use client";

import { useEffect } from "react";
import { Descriptions, Form, Modal, Select } from "antd";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { assignable_role_options } from "../helpers/role_labels";
import type { MemberRole } from "@fluiuae/database/enums";
import type { MemberDto } from "@/types/api";

type MemberEditValues = {
  role: MemberRole;
};

type MemberEditModalProps = {
  member: MemberDto | null;
  is_submitting: boolean;
  is_removing: boolean;
  on_cancel: () => void;
  on_submit: (member: MemberDto, role: MemberRole) => void;
  on_remove: (member: MemberDto) => void;
};

export const MemberEditModal = ({
  member,
  is_submitting,
  is_removing,
  on_cancel,
  on_submit,
  on_remove,
}: MemberEditModalProps) => {
  const [form] = Form.useForm<MemberEditValues>();

  useEffect(() => {
    if (member) {
      form.setFieldsValue({ role: member.role });
    }
  }, [form, member]);

  return (
    <Modal
      open={Boolean(member)}
      title={member ? `Editar ${member.user.name}` : ""}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label="Remover da carteira"
          confirm_message={`Remover ${member?.user.name ?? "este membro"} da carteira? A pessoa perde o acesso na hora.`}
          is_delete_visible={Boolean(member)}
          is_deleting={is_removing}
          on_delete={() => member && on_remove(member)}
        >
          <CancelBtn />
          <OkBtn />
        </ModalFooterWithDelete>
      )}
    >
      {member ? (
        <>
          <Descriptions column={1} size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="E-mail">{member.user.email}</Descriptions.Item>
            <Descriptions.Item label="Telefone">{member.user.phone ?? "Não informado"}</Descriptions.Item>
          </Descriptions>
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(values) => on_submit(member, values.role)}
          >
            <Form.Item
              name="role"
              label="Papel"
              extra="Administrador pode lançar e editar. Visualizador só vê."
              rules={[{ required: true }]}
            >
              <Select options={assignable_role_options} />
            </Form.Item>
          </Form>
        </>
      ) : null}
    </Modal>
  );
};
