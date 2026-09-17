"use client";

import { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Select, Switch } from "antd";
import { account_type_options } from "../helpers/account_labels";
import {
  build_account_form_values,
  to_account_payload,
  type AccountFormValues,
} from "../helpers/account_form_values";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { use_institution_name_autofill } from "@/features/institutions/hooks/use_institution_name_autofill";
import { InstitutionFormItems } from "@/features/institutions/components/institution_form_items";
import type { AccountPayload } from "../api/accounts_api";
import type { AccountDto } from "@/types/api";

type AccountFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  is_deleting: boolean;
  account: AccountDto | null;
  on_cancel: () => void;
  on_submit: (payload: AccountPayload) => void;
  on_delete: (account: AccountDto) => void;
};

export const AccountFormModal = ({
  is_open,
  is_submitting,
  is_deleting,
  account,
  on_cancel,
  on_submit,
  on_delete,
}: AccountFormModalProps) => {
  const [form] = Form.useForm<AccountFormValues>();
  const handle_values_change = use_institution_name_autofill(form);
  const institution_choice = Form.useWatch("institution_choice", form);

  useEffect(() => {
    if (is_open) {
      form.setFieldsValue(build_account_form_values(account));
    }
  }, [account, form, is_open]);

  return (
    <Modal
      open={is_open}
      title={account ? "Editar conta" : "Nova conta"}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label="Excluir conta"
          confirm_message={`Tem certeza que deseja excluir a conta “${account?.name ?? ""}”?`}
          is_delete_visible={Boolean(account)}
          is_deleting={is_deleting}
          on_delete={() => account && on_delete(account)}
        >
          <CancelBtn />
          <OkBtn />
        </ModalFooterWithDelete>
      )}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onValuesChange={handle_values_change}
        onFinish={(values) => on_submit(to_account_payload(values))}
      >
        <InstitutionFormItems selected_choice={institution_choice} />
        <Form.Item
          name="name"
          label="Nome da conta"
          extra="Como você quer ver essa conta no app."
          rules={[{ required: true, min: 2, message: "Dê um nome com pelo menos 2 letras" }]}
        >
          <Input placeholder="Ex.: Nubank, Conta do salário" />
        </Form.Item>
        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <Select options={account_type_options} />
        </Form.Item>
        <Form.Item name="initial_balance" label="Saldo inicial" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," />
        </Form.Item>
        <Form.Item
          name="is_default"
          label="Conta padrão"
          valuePropName="checked"
          extra="Já vem escolhida quando você adiciona um lançamento. Só uma conta pode ser a padrão."
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
