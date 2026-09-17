"use client";

import type { FormInstance } from "antd";
import { other_institution_value } from "../helpers/institution_search";
import { use_institutions } from "./use_institutions";

type InstitutionChoiceChange = {
  institution_choice?: string;
};

export const use_institution_name_autofill = (form: FormInstance) => {
  const { institutions } = use_institutions();

  return (changed_values: InstitutionChoiceChange) => {
    const chosen_ispb = changed_values.institution_choice;

    if (!chosen_ispb || chosen_ispb === other_institution_value || form.getFieldValue("name")) {
      return;
    }

    const chosen_institution = institutions.find((item) => item.ispb === chosen_ispb);

    if (chosen_institution) {
      form.setFields([{ name: "name", value: chosen_institution.name }]);
    }
  };
};
