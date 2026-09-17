"use client";

import { CategoryKind } from "@fluiuae/database/enums";
import { ChoiceToggle, type ChoiceOption } from "@/components/form/choice_toggle";
import { translate_category_kind } from "../helpers/category_labels";

type EditableCategoryKind = typeof CategoryKind.EXPENSE | typeof CategoryKind.INCOME;

const kind_options: ChoiceOption<EditableCategoryKind>[] = [
  { value: CategoryKind.EXPENSE, label: translate_category_kind(CategoryKind.EXPENSE), tone: "danger" },
  { value: CategoryKind.INCOME, label: translate_category_kind(CategoryKind.INCOME), tone: "income" },
];

type CategoryKindToggleProps = {
  id?: string;
  value?: EditableCategoryKind;
  onChange?: (value: EditableCategoryKind) => void;
};

export const CategoryKindToggle = (props: CategoryKindToggleProps) => (
  <ChoiceToggle {...props} options={kind_options} label="Tipo da categoria" />
);
