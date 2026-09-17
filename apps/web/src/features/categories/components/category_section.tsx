"use client";

import { CategoryRow } from "./category_row";
import {
  CategoryEmptyMessage,
  CategoryList,
  CategorySectionBlock,
  CategorySectionHeader,
  CategorySectionHint,
  CategorySectionTitle,
} from "./category_list_styles";
import type { CategoryDto } from "@/types/api";

type CategorySectionProps = {
  id: string;
  title: string;
  hint?: string;
  empty_message: string;
  categories: CategoryDto[];
  can_write: boolean;
  on_edit: (category: CategoryDto) => void;
};

export const CategorySection = ({
  id,
  title,
  hint,
  empty_message,
  categories,
  can_write,
  on_edit,
}: CategorySectionProps) => (
  <CategorySectionBlock aria-labelledby={id}>
    <CategorySectionHeader>
      <CategorySectionTitle id={id}>{title}</CategorySectionTitle>
      {hint ? <CategorySectionHint>{hint}</CategorySectionHint> : null}
    </CategorySectionHeader>
    {categories.length === 0 ? (
      <CategoryEmptyMessage>{empty_message}</CategoryEmptyMessage>
    ) : (
      <CategoryList>
        {categories.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            can_write={can_write}
            on_edit={on_edit}
          />
        ))}
      </CategoryList>
    )}
  </CategorySectionBlock>
);
