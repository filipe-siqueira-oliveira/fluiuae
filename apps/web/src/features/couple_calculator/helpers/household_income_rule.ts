import type { FormRule } from "antd";

export const household_income_rule: FormRule = ({ getFieldValue }) => ({
  validator: (_, second_salary: number | null) =>
    Number(getFieldValue("first_salary") ?? 0) + Number(second_salary ?? 0) > 0
      ? Promise.resolve()
      : Promise.reject(new Error("Pelo menos um salário precisa ser maior que zero")),
});
