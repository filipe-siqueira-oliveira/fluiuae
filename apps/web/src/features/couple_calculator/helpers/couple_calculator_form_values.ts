import { read_salary_default, store_salary_default } from "./salary_defaults_storage";

export type CoupleCalculatorFormValues = {
  first_salary: number | null;
  second_salary: number | null;
  keeps_first_salary: boolean;
  keeps_second_salary: boolean;
  purchase_amount: number | null;
  installment_count: number | null;
};

export const build_couple_calculator_form_values = (): CoupleCalculatorFormValues => {
  const first_salary = read_salary_default("first");
  const second_salary = read_salary_default("second");

  return {
    first_salary,
    second_salary,
    keeps_first_salary: first_salary !== null,
    keeps_second_salary: second_salary !== null,
    purchase_amount: null,
    installment_count: 1,
  };
};

export const remember_salary_defaults = (values: CoupleCalculatorFormValues): void => {
  store_salary_default("first", values.keeps_first_salary ? values.first_salary : null);
  store_salary_default("second", values.keeps_second_salary ? values.second_salary : null);
};
