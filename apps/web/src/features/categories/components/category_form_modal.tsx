"use client";

import { useEffect } from "react";
import { Form, Input, Modal } from "antd";
import { CategoryKind } from "@fluiuae/database/enums";
import { ModalFooterWithDelete } from "@/components/feedback/modal_footer_with_delete";
import { suggest_category_color } from "../helpers/category_colors";
import { CategoryColorField } from "./category_color_field";
import { FieldLabel } from "./category_form_styles";
import { CategoryKindToggle } from "./category_kind_toggle";
import type { CategoryPayload } from "../api/categories_api";
import type { CategoryDto } from "@/types/api";

type CategoryFormModalProps = {
  is_open: boolean;
  is_submitting: boolean;
  is_deleting: boolean;
  category: CategoryDto | null;
  categories: CategoryDto[];
  on_cancel: () => void;
  on_submit: (payload: CategoryPayload) => void;
  on_delete: (category: CategoryDto) => void;
};

export const CategoryFormModal = ({
  is_open,
  is_submitting,
  is_deleting,
  category,
  categories,
  on_cancel,
  on_submit,
  on_delete,
}: CategoryFormModalProps) => {
  const [form] = Form.useForm<CategoryPayload>();

  useEffect(() => {
    if (!is_open) {
      return;
    }

    form.setFieldsValue({
      kind: category?.kind ?? CategoryKind.EXPENSE,
      name: category?.name ?? "",
      color: category?.color ?? suggest_category_color(categories),
    });
  }, [categories, category, form, is_open]);

  return (
    <Modal
      open={is_open}
      title={category ? "Editar categoria" : "Nova categoria"}
      okText="Salvar"
      cancelText="Cancelar"
      confirmLoading={is_submitting}
      onCancel={on_cancel}
      onOk={() => form.submit()}
      destroyOnHidden
      footer={(_, { OkBtn, CancelBtn }) => (
        <ModalFooterWithDelete
          delete_label="Excluir categoria"
          confirm_message={`Excluir a categoria “${category?.name ?? ""}”? Se ela já tiver lançamentos, fica arquivada.`}
          is_delete_visible={Boolean(category)}
          is_deleting={is_deleting}
          on_delete={() => category && on_delete(category)}
        >
          <CancelBtn />
          <OkBtn />
        </ModalFooterWithDelete>
      )}
    >
      <Form form={form} layout="vertical" onFinish={on_submit} requiredMark={false}>
        <Form.Item name="kind" label={<FieldLabel>Tipo</FieldLabel>} rules={[{ required: true }]}>
          <CategoryKindToggle />
        </Form.Item>
        <Form.Item
          name="name"
          label={<FieldLabel>Nome</FieldLabel>}
          rules={[{ required: true, min: 2, message: "Dê um nome com pelo menos 2 letras" }]}
        >
          <Input size="large" placeholder="Ex.: Mercado" />
        </Form.Item>
        <Form.Item
          name="color"
          label={<FieldLabel>Cor</FieldLabel>}
          rules={[{ required: true, message: "Escolha uma cor" }]}
        >
          <CategoryColorField />
        </Form.Item>
      </Form>
    </Modal>
  );
};
