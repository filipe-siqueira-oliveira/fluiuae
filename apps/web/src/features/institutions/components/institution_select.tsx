"use client";

import { useMemo } from "react";
import { Select } from "antd";
import { use_institutions } from "../hooks/use_institutions";
import {
  build_institution_search_text,
  normalize_search_text,
  other_institution_value,
} from "../helpers/institution_search";
import { InstitutionOptionLabel } from "./institution_option_label";
import type { InstitutionDto } from "@/types/api";

const other_institution_label = "Digitar o nome da instituição";

type InstitutionOption = {
  value: string;
  label: string;
  search_text: string;
};

type InstitutionSelectProps = {
  value?: string;
  onChange?: (value: string | undefined) => void;
};

const to_option = (institution: InstitutionDto): InstitutionOption => ({
  value: institution.ispb,
  label: institution.name,
  search_text: build_institution_search_text(institution),
});

export const InstitutionSelect = ({ value, onChange }: InstitutionSelectProps) => {
  const { institutions, is_loading, has_failed } = use_institutions();

  const institution_by_ispb = useMemo(
    () => new Map(institutions.map((institution) => [institution.ispb, institution])),
    [institutions]
  );

  const grouped_options = useMemo(
    () => [
      {
        label: "Mais usados",
        options: institutions.filter((item) => item.is_featured).map(to_option),
      },
      {
        label: "Outras instituições",
        options: institutions.filter((item) => !item.is_featured).map(to_option),
      },
      {
        label: "Não encontrou?",
        options: [{ value: other_institution_value, label: other_institution_label, search_text: "" }],
      },
    ],
    [institutions]
  );

  const render_institution = (ispb: string, fallback: React.ReactNode, show_code: boolean) => {
    const institution = institution_by_ispb.get(ispb);

    return institution ? (
      <InstitutionOptionLabel institution={institution} show_code={show_code} />
    ) : (
      fallback
    );
  };

  return (
    <Select<string>
      showSearch
      allowClear
      value={value}
      onChange={(next_value) => onChange?.(next_value)}
      loading={is_loading}
      placeholder={has_failed ? "Não foi possível carregar a lista" : "Busque pelo nome ou código"}
      options={grouped_options}
      optionRender={(option) => render_institution(String(option.value), option.label, true)}
      labelRender={(selected) => render_institution(String(selected.value), selected.label, false)}
      filterOption={(input, option) => {
        const institution_option = option as Partial<InstitutionOption> | undefined;

        if (institution_option?.value === other_institution_value) {
          return true;
        }

        if (typeof institution_option?.search_text !== "string") {
          return false;
        }

        return institution_option.search_text.includes(normalize_search_text(input));
      }}
      notFoundContent={is_loading ? "Carregando instituições..." : "Nenhuma instituição encontrada"}
    />
  );
};
