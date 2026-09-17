"use client";

import { Tooltip } from "antd";
import { Lock } from "lucide-react";
import { is_system_category } from "@/lib/category_compatibility";
import {
  CategoryDot,
  CategoryIdentity,
  CategoryLockedMark,
  CategoryName,
  CategoryRowButton,
  CategoryRowItem,
} from "./category_list_styles";
import type { CategoryDto } from "@/types/api";

type CategoryRowProps = {
  category: CategoryDto;
  can_write: boolean;
  on_edit: (category: CategoryDto) => void;
};

export const CategoryRow = ({ category, can_write, on_edit }: CategoryRowProps) => {
  const identity = (
    <CategoryIdentity>
      <CategoryDot $color={category.color} aria-hidden="true" />
      <CategoryName title={category.name}>{category.name}</CategoryName>
    </CategoryIdentity>
  );

  if (is_system_category(category)) {
    return (
      <CategoryRowItem $is_locked>
        {identity}
        <Tooltip title="Categoria do sistema: não pode ser editada nem excluída">
          <CategoryLockedMark aria-label="Categoria do sistema, bloqueada" role="img">
            <Lock size={15} strokeWidth={1.75} />
          </CategoryLockedMark>
        </Tooltip>
      </CategoryRowItem>
    );
  }

  return (
    <CategoryRowItem $is_locked={false}>
      <CategoryRowButton
        type="button"
        disabled={!can_write}
        aria-label={`Editar categoria ${category.name}`}
        onClick={() => on_edit(category)}
      >
        {identity}
      </CategoryRowButton>
    </CategoryRowItem>
  );
};
