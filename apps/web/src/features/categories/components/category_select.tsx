"use client";

import { Select } from "antd";
import { build_category_select_options } from "@/lib/category_select_options";
import { CategoryOptionLabel } from "./category_option_label";
import type { CategoryKind } from "@fluiuae/database/enums";
import type { CategoryDto, CategoryReferenceDto } from "@/types/api";

type CategorySelectProps = {
  id?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  categories: CategoryDto[];
  kind: CategoryKind;
  current_category?: CategoryReferenceDto | null;
  placeholder?: string;
  is_disabled?: boolean;
};

export const CategorySelect = ({
  id,
  value,
  onChange,
  categories,
  kind,
  current_category,
  placeholder = "Escolha uma categoria",
  is_disabled = false,
}: CategorySelectProps) => {
  const options = build_category_select_options(categories, kind, current_category);

  return (
    <Select<string>
      id={id}
      value={value ?? undefined}
      onChange={(next_value) => onChange?.(next_value ?? null)}
      options={options}
      placeholder={placeholder}
      disabled={is_disabled}
      style={{ width: "100%" }}
      allowClear
      showSearch
      optionFilterProp="label"
      optionRender={(option) => (
        <CategoryOptionLabel name={String(option.label)} color={option.data.color} />
      )}
      labelRender={(selected) => {
        const match = options.find((option) => option.value === selected.value);

        return match ? <CategoryOptionLabel name={match.label} color={match.color} /> : selected.label;
      }}
    />
  );
};
