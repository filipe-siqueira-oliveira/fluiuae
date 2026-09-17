"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import { Alert, Col, DatePicker, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { CategoryKind, TransactionType } from "@fluiuae/database/enums";
import { ChoiceToggle, type ChoiceOption } from "@/components/form/choice_toggle";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { find_default_category_id } from "@/lib/category_compatibility";
import { CategorySelect } from "@/features/categories/components/category_select";
import { AutomaticDebitField } from "@/features/payment_sources/components/automatic_debit_field";
import { PaymentSourceSelect } from "@/features/payment_sources/components/payment_source_select";
import {
  is_credit_card_source,
  resolve_default_payment_source,
} from "@/features/payment_sources/helpers/payment_source_value";
import {
  build_initial_form_values,
  to_transaction_payload,
  type TransactionFormValues,
} from "../helpers/transaction_form_values";
import type { TransactionPayload } from "../api/transactions_api";
import type { AccountDto, CategoryDto, CreditCardDto, TransactionDto } from "@/types/api";

const to_category_kind = (type: TransactionType | undefined) =>
  type === TransactionType.INCOME ? CategoryKind.INCOME : CategoryKind.EXPENSE;

const type_options: ChoiceOption<TransactionType>[] = [
  { value: TransactionType.EXPENSE, label: "Despesa", tone: "danger" },
  { value: TransactionType.INCOME, label: "Receita", tone: "income" },
  { value: TransactionType.TRANSFER, label: "Transferência", tone: "warning" },
];

const past_date_hints: Record<TransactionType, string> = {
  [TransactionType.EXPENSE]: "Data já passou: entra como pago.",
  [TransactionType.INCOME]: "Data já passou: entra como recebido.",
  [TransactionType.TRANSFER]: "Data já passou: entra como feita.",
};

type TransactionFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  is_deleting: boolean;
  transaction: TransactionDto | null;
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  categories: CategoryDto[];
  on_cancel: () => void;
  on_submit: (payload: TransactionPayload) => void;
  on_delete: (transaction: TransactionDto) => void;
};

export const TransactionFormModal = ({
  is_open,
  is_submitting,
  is_deleting,
  transaction,
  accounts,
  credit_cards,
  categories,
  on_cancel,
  on_submit,
  on_delete,
}: TransactionFormModalProps) => {
  const [form] = Form.useForm<TransactionFormValues>();
  const selected_type = Form.useWatch("type", form);
  const selected_payment_source = Form.useWatch("payment_source", form);
  const is_card_purchase = is_credit_card_source(selected_payment_source);
  const is_automatic_debit = Form.useWatch("is_automatic_debit", { form, preserve: true }) ?? false;
  const selected_date = Form.useWatch("issued_at", form);
  const is_past_date = Boolean(selected_date && dayjs(selected_date).isBefore(dayjs(), "day"));
  const is_expense = (selected_type ?? TransactionType.EXPENSE) === TransactionType.EXPENSE;
  const shows_automatic_debit = is_expense && Boolean(selected_payment_source) && !is_card_purchase && !is_past_date;

  useEffect(() => {
    if (!is_open) {
      return;
    }

    form.setFieldsValue(
      build_initial_form_values(
        transaction,
        resolve_default_payment_source({
          accounts,
          credit_cards,
          allows_credit_card: true,
          falls_back_to_first_account: false,
        }),
        find_default_category_id(categories, CategoryKind.EXPENSE)
      )
    );
  }, [accounts, categories, credit_cards, form, is_open, transaction]);

  const handle_values_change = (changed_values: Partial<TransactionFormValues>) => {
    if (changed_values.type !== undefined) {
      form.setFields([{ name: "category_id", value: find_default_category_id(categories, to_category_kind(changed_values.type)) }]);
    }

    const is_leaving_expense =
      changed_values.type !== undefined && changed_values.type !== TransactionType.EXPENSE;

    if (is_leaving_expense && is_credit_card_source(form.getFieldValue("payment_source"))) {
      form.setFields([{ name: "payment_source", value: undefined }]);
    }
  };

  const payment_source_label = {
    [TransactionType.EXPENSE]: "Pagar com",
    [TransactionType.INCOME]: "Conta",
    [TransactionType.TRANSFER]: "Conta de origem",
  }[selected_type ?? TransactionType.EXPENSE];

  const account_options = accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));

  const category_kind = to_category_kind(selected_type);
  const is_locked = Boolean(transaction?.is_statement_payment);

  return (
    <Modal
      open={is_open}
      title={is_locked ? "Pagamento de fatura" : transaction ? "Editar lançamento" : "Novo lançamento"}
      okText="Salvar"
      cancelText={is_locked ? "Fechar" : "Cancelar"}
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      width={640}
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label={is_locked ? "Excluir pagamento" : "Excluir lançamento"}
          confirm_message={
            is_locked ? "Excluir este pagamento? A fatura volta a ficar a pagar." : "Excluir este lançamento?"
          }
          is_delete_visible={Boolean(transaction)}
          is_deleting={is_deleting}
          on_delete={() => transaction && on_delete(transaction)}
        >
          <CancelBtn />
          {is_locked ? null : <OkBtn />}
        </ModalFooterWithDelete>
      )}
    >
      {is_locked ? (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="Este lançamento é o pagamento de uma fatura."
          description="Para mudar o valor ou a conta, desfaça o pagamento em Cartões e faturas e pague de novo."
        />
      ) : null}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        disabled={is_locked}
        onValuesChange={handle_values_change}
        onFinish={(values) => on_submit(to_transaction_payload({ ...form.getFieldsValue(true), ...values }))}
      >
        <Form.Item name="type" label="Tipo" rules={[{ required: true }]}>
          <ChoiceToggle options={type_options} label="Tipo do lançamento" disabled={is_locked} />
        </Form.Item>
        <Form.Item name="description" label="Descrição" rules={[{ required: true, min: 1 }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Valor"
          rules={[{ required: true, type: "number", min: 0.01 }]}
        >
          <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} />
        </Form.Item>
        <Form.Item
          name="issued_at"
          label="Data"
          rules={[{ required: true }]}
          extra={is_past_date && !is_card_purchase ? past_date_hints[selected_type ?? TransactionType.EXPENSE] : undefined}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="payment_source"
              label={payment_source_label}
              rules={[{ required: true, message: "Escolha de onde sai o dinheiro" }]}
            >
              <PaymentSourceSelect
                accounts={accounts}
                credit_cards={credit_cards}
                allows_credit_card={selected_type === TransactionType.EXPENSE}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            {selected_type === TransactionType.TRANSFER ? (
              <Form.Item
                name="destination_account_id"
                label="Conta de destino"
                rules={[{ required: true, message: "Escolha a conta de destino" }]}
              >
                <Select options={account_options} />
              </Form.Item>
            ) : (
              <Form.Item name="category_id" label="Categoria">
                <CategorySelect
                  categories={categories}
                  kind={category_kind}
                  current_category={transaction?.category}
                />
              </Form.Item>
            )}
          </Col>
        </Row>
        {shows_automatic_debit ? <AutomaticDebitField is_checked={is_automatic_debit} /> : null}
        <Form.Item name="notes" label="Observações">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
