"use client";

import styled from "styled-components";
import { CategoryDot } from "./category_list_styles";

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const Name = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type CategoryOptionLabelProps = {
  name: string;
  color: string;
};

export const CategoryOptionLabel = ({ name, color }: CategoryOptionLabelProps) => (
  <Label>
    <CategoryDot $color={color} aria-hidden="true" />
    <Name>{name}</Name>
  </Label>
);
