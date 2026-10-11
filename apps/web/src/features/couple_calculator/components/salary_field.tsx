"use client";

import { Checkbox, Form, InputNumber, type FormRule } from "antd";
import { SalaryGroup } from "./couple_calculator_styles";

type SalaryFieldProps = {
  label: string;
  salary_name: "first_salary" | "second_salary";
  keeps_name: "keeps_first_salary" | "keeps_second_salary";
  dependencies?: string[];
  extra_rules?: FormRule[];
};

export const SalaryField = ({ label, salary_name, keeps_name, dependencies, extra_rules = [] }: SalaryFieldProps) => (
  <SalaryGroup>
    <Form.Item
      name={salary_name}
      label={label}
      dependencies={dependencies}
      style={{ marginBottom: 8 }}
      rules={[{ required: true, type: "number", min: 0, message: "Informe o salário" }, ...extra_rules]}
    >
      <InputNumber style={{ width: "100%" }} precision={2} decimalSeparator="," min={0} prefix="R$" />
    </Form.Item>
    <Form.Item name={keeps_name} valuePropName="checked" noStyle>
      <Checkbox>Usar sempre este valor</Checkbox>
    </Form.Item>
  </SalaryGroup>
);
