"use client";

import { useEffect } from "react";
import { Col, Form, Input, InputNumber, Modal, Row, Switch } from "antd";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { InstitutionFormItems } from "@/features/institutions/components/institution_form_items";
import { use_institution_name_autofill } from "@/features/institutions/hooks/use_institution_name_autofill";
import {
  build_credit_card_form_values,
  to_credit_card_payload,
  type CreditCardFormValues,
} from "../helpers/credit_card_form_values";
import type { CreditCardPayload } from "../api/credit_cards_api";
import type { CreditCardDto } from "@/types/api";

type CreditCardFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  is_deleting: boolean;
  credit_card: CreditCardDto | null;
  on_cancel: () => void;
  on_submit: (payload: CreditCardPayload) => void;
  on_delete: (credit_card: CreditCardDto) => void;
};

const day_rules = (message: string) => [
  { required: true, message },
  { type: "number" as const, min: 1, max: 31, message: "Use um dia entre 1 e 31" },
];

export const CreditCardFormModal = ({
  is_open,
  is_submitting,
  is_deleting,
  credit_card,
  on_cancel,
  on_submit,
  on_delete,
}: CreditCardFormModalProps) => {
  const [form] = Form.useForm<CreditCardFormValues>();
  const institution_choice = Form.useWatch("institution_choice", form);
  const handle_values_change = use_institution_name_autofill(form);

  useEffect(() => {
    if (is_open) {
      form.setFieldsValue(build_credit_card_form_values(credit_card));
    }
  }, [credit_card, form, is_open]);

  return (
    <Modal
      open={is_open}
      title={credit_card ? "Editar cartão" : "Novo cartão"}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label="Excluir cartão"
          confirm_message={`Tem certeza que deseja excluir o cartão “${credit_card?.name ?? ""}”?`}
          is_delete_visible={Boolean(credit_card)}
          is_deleting={is_deleting}
          on_delete={() => credit_card && on_delete(credit_card)}
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
        onFinish={(values) => on_submit(to_credit_card_payload(values))}
      >
        <InstitutionFormItems selected_choice={institution_choice} />
        <Form.Item
          name="name"
          label="Nome do cartão"
          rules={[{ required: true, min: 2, message: "Dê um nome com pelo menos 2 letras" }]}
        >
          <Input placeholder="Ex.: Nubank Ultravioleta" />
        </Form.Item>
        <Form.Item
          name="credit_limit"
          label="Limite"
          rules={[{ required: true, type: "number", min: 0.01, message: "Informe o limite do cartão" }]}
        >
          <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="statement_closing_day"
              label="Fechamento da fatura"
              extra="Dia do mês em que a fatura fecha."
              rules={day_rules("Informe o dia do fechamento")}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={31} precision={0} prefix="Dia" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="payment_due_day"
              label="Vencimento da fatura"
              extra="Dia do mês para pagar a fatura."
              rules={day_rules("Informe o dia do vencimento")}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={31} precision={0} prefix="Dia" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="is_default"
          label="Cartão padrão"
          valuePropName="checked"
          extra="Só um cartão pode ser o padrão."
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
