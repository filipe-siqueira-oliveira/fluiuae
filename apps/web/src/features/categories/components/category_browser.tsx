"use client";

import { useState } from "react";
import { Segmented } from "antd";
import { CategoryKind } from "@fluiuae/database/enums";
import { PanelHeading } from "@/components/feedback/panel_heading";
import { build_category_sections, count_categories_by_kind } from "../helpers/category_groups";
import { CategorySection } from "./category_section";
import { KindCount, SegmentedSlot } from "./category_list_styles";
import type { CategoryDto } from "@/types/api";

type EditableKind = typeof CategoryKind.EXPENSE | typeof CategoryKind.INCOME;

type CategoryBrowserProps = {
  categories: CategoryDto[];
  can_write: boolean;
  on_edit: (category: CategoryDto) => void;
};

const kind_copy: Record<EditableKind, { label: string; empty: string }> = {
  [CategoryKind.EXPENSE]: { label: "Despesas", empty: "Nenhuma categoria de despesa sua. Crie uma, como Mercado." },
  [CategoryKind.INCOME]: { label: "Receitas", empty: "Nenhuma categoria de receita sua. Crie uma, como Salário." },
};

const describe_total = (total: number): string => (total === 1 ? "1 categoria" : `${total} categorias`);

export const CategoryBrowser = ({ categories, can_write, on_edit }: CategoryBrowserProps) => {
  const [kind, set_kind] = useState<EditableKind>(CategoryKind.EXPENSE);
  const sections = build_category_sections(categories, kind);

  return (
    <>
      <PanelHeading
        title="Suas categorias"
        meta={describe_total(categories.length)}
        actions={
          <SegmentedSlot data-tour="categories_kind">
            <Segmented<EditableKind>
              value={kind}
              onChange={set_kind}
              options={[CategoryKind.EXPENSE, CategoryKind.INCOME].map((option) => ({
                value: option as EditableKind,
                label: (
                  <>
                    {kind_copy[option as EditableKind].label}
                    <KindCount>{count_categories_by_kind(categories, option)}</KindCount>
                  </>
                ),
              }))}
            />
          </SegmentedSlot>
        }
      />
      <CategorySection
        id={`custom_categories_${kind}`}
        title="Criadas por você"
        empty_message={kind_copy[kind].empty}
        categories={sections.custom}
        can_write={can_write}
        on_edit={on_edit}
      />
      <CategorySection
        id={`system_categories_${kind}`}
        title="Do sistema"
        hint="Usadas em faturas e transferências. Não dá para editar nem excluir."
        empty_message="Nenhuma categoria do sistema para este tipo."
        categories={sections.system}
        can_write={can_write}
        on_edit={on_edit}
      />
    </>
  );
};
