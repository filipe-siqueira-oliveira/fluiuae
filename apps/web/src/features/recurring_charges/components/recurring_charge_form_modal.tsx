"use client";

import { useEffect } from "react";
import { Col, DatePicker, Form, Input, InputNumber, Modal, Row, Typography } from "antd";
import { PaymentSourceSelect } from "@/features/payment_sources/components/payment_source_select";
import { AutomaticDebitField } from "@/features/payment_sources/components/automatic_debit_field";
import {
  is_credit_card_source,
  resolve_default_payment_source,
} from "@/features/payment_sources/helpers/payment_source_value";
import { CategoryKind } from "@fluiuae/database/enums";
import { find_default_category_id } from "@/lib/category_compatibility";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { CategorySelect } from "@/features/categories/components/category_select";
import { format_money } from "@/lib/money_formatter";
import {
  build_recurring_charge_form_values,
  type RecurringChargeFormValues,
} from "../helpers/recurring_charge_form_values";
import type { AccountDto, CategoryDto, CreditCardDto, RecurringChargeDto } from "@/types/api";

type RecurringChargeFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  is_deleting: boolean;
  recurring_charge: RecurringChargeDto | null;
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  categories: CategoryDto[];
  on_cancel: () => void;
  on_submit: (values: RecurringChargeFormValues) => void;
  on_delete: (recurring_charge: RecurringChargeDto) => void;
};

export const RecurringChargeFormModal = ({
  is_open,
  is_submitting,
  is_deleting,
  recurring_charge,
  accounts,
  credit_cards,
  categories,
  on_cancel,
  on_submit,
  on_delete,
}: RecurringChargeFormModalProps) => {
  const [form] = Form.useForm<RecurringChargeFormValues>();
  const selected_payment_source = Form.useWatch("payment_source", form);
  const is_automatic_debit = Form.useWatch("is_automatic_debit", { form, preserve: true }) ?? false;
  const shows_automatic_debit = Boolean(selected_payment_source) && !is_credit_card_source(selected_payment_source);
  const installment_amount = Form.useWatch("installment_amount", form) ?? 0;
  const installment_count = Form.useWatch("installment_count", form) ?? 0;
  const minimum_count = Math.max(2, recurring_charge?.generated_count ?? 0);

  useEffect(() => {
    if (is_open) {
      form.setFieldsValue(
        build_recurring_charge_form_values(
          recurring_charge,
          resolve_default_payment_source({
            accounts,
            credit_cards,
            allows_credit_card: true,
            falls_back_to_first_account: true,
          }),
          find_default_category_id(categories, CategoryKind.EXPENSE)
        )
      );
    }
  }, [accounts, categories, credit_cards, form, is_open, recurring_charge]);

  return (
    <Modal
      open={is_open}
      title={recurring_charge ? "Editar recorrência" : "Nova recorrência"}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label="Excluir recorrência"
          confirm_message="Excluir esta recorrência? As parcelas já lançadas continuam."
          is_delete_visible={Boolean(recurring_charge)}
          is_deleting={is_deleting}
          on_delete={() => recurring_charge && on_delete(recurring_charge)}
        >
          <CancelBtn />
          <OkBtn />
        </ModalFooterWithDelete>
      )}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={on_submit}>
        <Form.Item
          name="description"
          label="Descrição"
          rules={[{ required: true, message: "Descreva a cobrança" }]}
        >
          <Input placeholder="Ex.: Notebook, curso de inglês" />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="installment_amount"
              label="Valor da parcela"
              rules={[{ required: true, type: "number", min: 0.01, message: "Informe o valor" }]}
            >
              <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="installment_count"
              label="Parcelas"
              rules={[
                {
                  required: true,
                  type: "number",
                  min: minimum_count,
                  message: `Informe ao menos ${minimum_count} parcelas`,
                },
              ]}
            >
              <InputNumber style={{ width: "100%" }} min={minimum_count} max={420} precision={0} suffix="vezes" />
            </Form.Item>
          </Col>
        </Row>
        <Typography.Paragraph type="secondary" style={{ marginTop: -8 }}>
          Total: {format_money(Number(installment_amount) * Number(installment_count))}
        </Typography.Paragraph>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="starts_at_month"
              label="Primeira parcela em"
              extra={recurring_charge ? "Não muda depois de criada." : "Se já pagou algumas, cadastre só as que faltam."}
              rules={[{ required: true, message: "Escolha o mês" }]}
            >
              <DatePicker
                picker="month"
                format="MMM/YYYY"
                style={{ width: "100%" }}
                disabled={Boolean(recurring_charge)}
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              name="day_of_month"
              label="Dia do mês"
              rules={[{ required: true, type: "number", min: 1, max: 31 }]}
            >
              <InputNumber style={{ width: "100%" }} min={1} max={31} precision={0} prefix="Dia" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="payment_source"
              label="Pagar com"
              rules={[{ required: true, message: "Escolha uma conta ou um cartão" }]}
            >
              <PaymentSourceSelect accounts={accounts} credit_cards={credit_cards} allows_credit_card />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="category_id" label="Categoria">
              <CategorySelect
                categories={categories}
                kind={CategoryKind.EXPENSE}
                current_category={recurring_charge?.category}
              />
            </Form.Item>
          </Col>
        </Row>
        {shows_automatic_debit ? <AutomaticDebitField is_checked={is_automatic_debit} /> : null}
      </Form>
    </Modal>
  );
};
