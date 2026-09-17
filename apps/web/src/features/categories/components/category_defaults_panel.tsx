"use client";

import { useState } from "react";
import { App } from "antd";
import { CategoryKind } from "@fluiuae/database/enums";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { SummaryRail } from "@/components/data/summary_rail";
import { find_default_category_id } from "@/lib/category_compatibility";
import { describe_request_error } from "@/lib/http_client";
import { set_default_category_request } from "../api/categories_api";
import { CategorySelect } from "./category_select";
import type { CategoryDto } from "@/types/api";

type CategoryDefaultsPanelProps = {
  categories: CategoryDto[];
  can_write: boolean;
};

export const CategoryDefaultsPanel = ({ categories, can_write }: CategoryDefaultsPanelProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [saving_kind, set_saving_kind] = useState<CategoryKind | null>(null);

  const handle_change = async (kind: CategoryKind, category_id: string | null) => {
    set_saving_kind(kind);

    try {
      await set_default_category_request(kind, category_id);
      message.success(category_id ? "Categoria padrão salva" : "Categoria padrão removida");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_saving_kind(null);
    }
  };

  const render_select = (kind: CategoryKind, id: string) => (
    <CategorySelect
      id={id}
      value={find_default_category_id(categories, kind)}
      onChange={(category_id) => handle_change(kind, category_id)}
      categories={categories}
      kind={kind}
      placeholder="Nenhuma"
      is_disabled={!can_write || saving_kind === kind}
    />
  );

  return (
    <SummaryRail
      items={[
        {
          key: "income_default",
          label: "Categoria padrão para RECEITAS",
          icon: <ArrowDownLeft size={15} strokeWidth={2} />,
          content: render_select(CategoryKind.INCOME, "default_income_category"),
          hint: "Já vem escolhida em receitas e receitas fixas.",
        },
        {
          key: "expense_default",
          label: "Categoria padrão para DESPESAS",
          icon: <ArrowUpRight size={15} strokeWidth={2} />,
          content: render_select(CategoryKind.EXPENSE, "default_expense_category"),
          hint: "Já vem escolhida em despesas, despesas fixas e recorrências.",
        },
      ]}
    />
  );
};
