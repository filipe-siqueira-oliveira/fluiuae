"use client";

import { useState } from "react";
import { App, Button } from "antd";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { CategoryDefaultsPanel } from "./components/category_defaults_panel";
import { CategoryBrowser } from "./components/category_browser";
import { CategoryFormModal } from "./components/category_form_modal";
import {
  create_category_request,
  delete_category_request,
  update_category_request,
  type CategoryPayload,
} from "./api/categories_api";
import type { CategoryDto } from "@/types/api";

type CategoriesViewProps = {
  categories: CategoryDto[];
  can_write: boolean;
};

export const CategoriesView = ({ categories, can_write }: CategoriesViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_category, set_selected_category] = useState<CategoryDto | null>(null);

  const open_create_modal = () => {
    set_selected_category(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (category: CategoryDto) => {
    set_selected_category(category);
    set_is_modal_open(true);
  };

  const handle_submit = async (payload: CategoryPayload) => {
    set_is_submitting(true);

    try {
      if (selected_category) {
        await update_category_request(selected_category.id, payload);
      } else {
        await create_category_request(payload);
      }

      set_is_modal_open(false);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (category: CategoryDto) => {
    set_is_deleting(true);

    try {
      await delete_category_request(category.id);
      set_is_modal_open(false);
      message.success("Categoria excluída");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  return (
    <PageSection
      title="Categorias"
      tour_prefix="categories"
      description="Dê nome aos seus gastos e ganhos para entender para onde vai o dinheiro."
      intro={<CategoryDefaultsPanel categories={categories} can_write={can_write} />}
      actions={
        <Button type="primary" icon={<Plus size={16} />} disabled={!can_write} onClick={open_create_modal}>
          Nova categoria
        </Button>
      }
    >
      <CategoryBrowser
        categories={categories}
        can_write={can_write}
        on_edit={open_edit_modal}
      />
      <CategoryFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        category={selected_category}
        categories={categories}
        on_cancel={() => set_is_modal_open(false)}
        on_submit={handle_submit}
        on_delete={handle_delete}
      />
    </PageSection>
  );
};
