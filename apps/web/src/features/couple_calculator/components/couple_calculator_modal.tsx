"use client";

import { useEffect, useRef, useState } from "react";
import { Form, InputNumber, Modal } from "antd";
import { calculate_proportional_split, type ProportionalSplit } from "../helpers/proportional_split";
import { household_income_rule } from "../helpers/household_income_rule";
import {
  build_couple_calculator_form_values,
  remember_salary_defaults,
  type CoupleCalculatorFormValues,
} from "../helpers/couple_calculator_form_values";
import { CoupleCalculatorIntro } from "./couple_calculator_intro";
import { FieldPairGrid, PurchaseGrid, ResultAnchor } from "./couple_calculator_styles";
import { SalaryField } from "./salary_field";
import { SharedPurchaseSection } from "./shared_purchase_section";
import { SplitResult } from "./split_result";
import type { WorkspaceSummaryDto } from "@/types/api";

const max_installment_count = 420;

const scrollable_body_style = {
  maxHeight: "calc(100dvh - 200px)",
  overflowY: "auto" as const,
  overscrollBehavior: "contain" as const,
  margin: "0 -6px",
  padding: "0 6px",
};

type CoupleCalculatorModalProps = {
  is_open: boolean;
  workspaces: WorkspaceSummaryDto[];
  on_close: () => void;
};

export const CoupleCalculatorModal = ({ is_open, workspaces, on_close }: CoupleCalculatorModalProps) => {
  const [form] = Form.useForm<CoupleCalculatorFormValues>();
  const [split, set_split] = useState<ProportionalSplit | null>(null);
  const result_anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!is_open) {
      return;
    }

    form.setFieldsValue(build_couple_calculator_form_values());
    set_split(null);
  }, [form, is_open]);

  useEffect(() => {
    if (split) {
      result_anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [split]);

  const calculate = (values: CoupleCalculatorFormValues) => {
    remember_salary_defaults(values);
    set_split(
      calculate_proportional_split({
        first_salary: values.first_salary ?? 0,
        second_salary: values.second_salary ?? 0,
        purchase_amount: values.purchase_amount ?? 0,
        installment_count: values.installment_count ?? 1,
      })
    );
  };

  return (
    <Modal
      open={is_open}
      title="Calculadora do casal"
      okText="Calcular"
      cancelText="Fechar"
      onCancel={on_close}
      onOk={() => form.submit()}
      centered
      destroyOnHidden
      styles={{ body: scrollable_body_style }}
      footer={(_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          {split ? null : <OkBtn />}
        </>
      )}
    >
      <CoupleCalculatorIntro />
      <Form form={form} layout="vertical" requiredMark={false} disabled={Boolean(split)} onFinish={calculate}>
        <FieldPairGrid>
          <SalaryField label="Salário 1" salary_name="first_salary" keeps_name="keeps_first_salary" />
          <SalaryField
            label="Salário 2"
            salary_name="second_salary"
            keeps_name="keeps_second_salary"
            dependencies={["first_salary"]}
            extra_rules={[household_income_rule]}
          />
        </FieldPairGrid>
        <PurchaseGrid>
          <Form.Item
            name="purchase_amount"
            label="Valor total da compra"
            rules={[{ required: true, type: "number", min: 0.01, message: "Informe o valor da compra" }]}
          >
            <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
          </Form.Item>
          <Form.Item
            name="installment_count"
            label="Parcelas"
            extra="1 = à vista"
            rules={[
              {
                required: true,
                type: "number",
                min: 1,
                max: max_installment_count,
                message: `Informe de 1 a ${max_installment_count} parcelas`,
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} precision={0} min={1} max={max_installment_count} />
          </Form.Item>
        </PurchaseGrid>
      </Form>
      {split ? (
        <ResultAnchor ref={result_anchor}>
          <SplitResult split={split} />
          <SharedPurchaseSection split={split} workspaces={workspaces} on_launched={on_close} />
        </ResultAnchor>
      ) : null}
    </Modal>
  );
};
