"use client";

import { useEffect } from "react";
import { Form, Input, InputNumber, Modal } from "antd";
import { find_default_category_id } from "@/lib/category_compatibility";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { CategorySelect } from "@/features/categories/components/category_select";
import { PaymentSourceSelect } from "@/features/payment_sources/components/payment_source_select";
import { AutomaticDebitField } from "@/features/payment_sources/components/automatic_debit_field";
import {
  is_credit_card_source,
  resolve_default_payment_source,
} from "@/features/payment_sources/helpers/payment_source_value";
import {
  build_fixed_transaction_form_values,
  to_fixed_transaction_payload,
  type FixedTransactionFormValues,
} from "../helpers/fixed_transaction_form_values";
import type { CategoryKind } from "@fluiuae/database/enums";
import type { FixedTransactionPayload } from "../api/fixed_transactions_api";
import type { AccountDto, CategoryDto, CreditCardDto, FixedTransactionDto } from "@/types/api";

type FixedTransactionFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  title: string;
  delete_label: string;
  delete_confirmation: string;
  is_deleting: boolean;
  fixed_transaction: FixedTransactionDto | null;
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  allows_credit_card: boolean;
  category_kind: CategoryKind;
  categories: CategoryDto[];
  on_cancel: () => void;
  on_submit: (payload: FixedTransactionPayload) => void;
  on_delete: (fixed_transaction: FixedTransactionDto) => void;
};

export const FixedTransactionFormModal = ({
  is_open,
  is_submitting,
  title,
  delete_label,
  delete_confirmation,
  is_deleting,
  fixed_transaction,
  accounts,
  credit_cards,
  allows_credit_card,
  category_kind,
  categories,
  on_cancel,
  on_submit,
  on_delete,
}: FixedTransactionFormModalProps) => {
  const [form] = Form.useForm<FixedTransactionFormValues>();
  const selected_payment_source = Form.useWatch("payment_source", form);
  const is_automatic_debit = Form.useWatch("is_automatic_debit", { form, preserve: true }) ?? false;
  const shows_automatic_debit = allows_credit_card && Boolean(selected_payment_source) && !is_credit_card_source(selected_payment_source);

  useEffect(() => {
    if (!is_open) {
      return;
    }

    form.setFieldsValue(
      build_fixed_transaction_form_values(
        fixed_transaction,
        resolve_default_payment_source({
          accounts,
          credit_cards,
          allows_credit_card,
          falls_back_to_first_account: true,
        }),
        find_default_category_id(categories, category_kind)
      )
    );
  }, [accounts, allows_credit_card, categories, category_kind, credit_cards, fixed_transaction, form, is_open]);

  return (
    <Modal
      open={is_open}
      title={title}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label={delete_label}
          confirm_message={delete_confirmation}
          is_delete_visible={Boolean(fixed_transaction)}
          is_deleting={is_deleting}
          on_delete={() => fixed_transaction && on_delete(fixed_transaction)}
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
        onFinish={(values) => on_submit(to_fixed_transaction_payload(values))}
      >
        <Form.Item name="description" label="Descrição" rules={[{ required: true }]}>
          <Input placeholder="Aluguel, salário, internet..." />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Valor"
          rules={[{ required: true, type: "number", min: 0.01, message: "Informe o valor" }]}
        >
          <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
        </Form.Item>
        <Form.Item
          name="day_of_month"
          label="Dia do mês"
          extra="Em meses mais curtos, usa o último dia do mês."
          rules={[{ required: true, type: "number", min: 1, max: 31 }]}
        >
          <InputNumber style={{ width: "100%" }} min={1} max={31} precision={0} prefix="Dia" />
        </Form.Item>
        <Form.Item
          name="payment_source"
          label={allows_credit_card ? "Pagar com" : "Conta"}
          rules={[{ required: true, message: "Escolha uma conta ou um cartão" }]}
        >
          <PaymentSourceSelect
            accounts={accounts}
            credit_cards={credit_cards}
            allows_credit_card={allows_credit_card}
          />
        </Form.Item>
        {shows_automatic_debit ? <AutomaticDebitField is_checked={is_automatic_debit} /> : null}
        <Form.Item name="category_id" label="Categoria">
          <CategorySelect
            categories={categories}
            kind={category_kind}
            current_category={fixed_transaction?.category}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
