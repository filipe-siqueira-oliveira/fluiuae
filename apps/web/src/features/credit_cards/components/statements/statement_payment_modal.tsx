"use client";

import { useEffect } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { DatePicker, Form, InputNumber, Modal, Select } from "antd";
import { PaymentSourceLabel } from "@/features/payment_sources/components/payment_source_label";
import { format_money } from "@/lib/money_formatter";
import { is_advance_payment_flow } from "../../helpers/statement_payment_labels";
import { format_statement_title } from "../../helpers/statement_labels";
import { PaymentAmount } from "./statements_modal_styles";
import type { StatementPaymentPayload } from "../../api/credit_card_statements_api";
import type { AccountDto, CreditCardStatementDetailDto } from "@/types/api";

type StatementPaymentFormValues = {
  account_id?: string;
  amount: number;
  paid_at: Dayjs;
};

type StatementPaymentModalProps = {
  statement: CreditCardStatementDetailDto | null;
  accounts: AccountDto[];
  is_submitting: boolean;
  on_cancel: () => void;
  on_submit: (payload: StatementPaymentPayload) => void;
};

const describe_modal_title = (statement: CreditCardStatementDetailDto): string => {
  const statement_title = format_statement_title(statement.due_date).toLowerCase();

  return is_advance_payment_flow(statement) ? `Antecipar pagamento da ${statement_title}` : `Pagar ${statement_title}`;
};

const describe_amount_hint = (statement: CreditCardStatementDetailDto): string =>
  is_advance_payment_flow(statement)
    ? "Entra como pagamento na fatura atual e libera o limite. Compras novas continuam entrando nela até fechar."
    : "Pode ser só uma parte. O que faltar continua em aberto nesta fatura.";

export const StatementPaymentModal = ({
  statement,
  accounts,
  is_submitting,
  on_cancel,
  on_submit,
}: StatementPaymentModalProps) => {
  const [form] = Form.useForm<StatementPaymentFormValues>();
  const active_accounts = accounts.filter((account) => !account.is_archived);
  const remaining_amount = Number(statement?.remaining_amount ?? 0);

  useEffect(() => {
    if (statement) {
      form.setFieldsValue({
        account_id: active_accounts.find((account) => account.is_default)?.id,
        amount: remaining_amount,
        paid_at: dayjs(),
      });
    }
  }, [statement]);

  return (
    <Modal
      open={Boolean(statement)}
      title={statement ? describe_modal_title(statement) : ""}
      okText={statement && is_advance_payment_flow(statement) ? "Antecipar pagamento" : "Pagar fatura"}
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
    >
      {statement ? (
        <PaymentAmount>
          <span>Valor em aberto</span>
          <strong>{format_money(remaining_amount)}</strong>
        </PaymentAmount>
      ) : null}
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={(values) =>
          on_submit({
            account_id: values.account_id ?? "",
            amount: values.amount,
            paid_at: values.paid_at.toISOString(),
          })
        }
      >
        <Form.Item
          name="amount"
          label="Valor do pagamento"
          extra={statement ? describe_amount_hint(statement) : undefined}
          rules={[
            { required: true, message: "Informe quanto vai pagar" },
            {
              type: "number",
              min: 0.01,
              max: remaining_amount,
              message: `Use um valor entre R$ 0,01 e ${format_money(remaining_amount)}`,
            },
          ]}
        >
          <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
        </Form.Item>
        <Form.Item
          name="account_id"
          label="Pagar com a conta"
          extra="O valor sai do saldo desta conta como uma despesa na categoria Cartão de crédito."
          rules={[{ required: true, message: "Escolha a conta que pagou a fatura" }]}
        >
          <Select
            placeholder="Escolha uma conta"
            options={active_accounts.map((account) => ({ value: account.id, label: account.name }))}
            optionRender={(option) => <PaymentSourceLabel kind="account" name={String(option.label)} />}
            labelRender={(selected) => <PaymentSourceLabel kind="account" name={String(selected.label)} />}
          />
        </Form.Item>
        <Form.Item
          name="paid_at"
          label="Data do pagamento"
          rules={[{ required: true, message: "Informe a data do pagamento" }]}
        >
          <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} allowClear={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
