"use client";

import { Plus } from "lucide-react";
import { AddTileButton, AddTileDescription, AddTileIcon, AddTileTitle } from "./gallery_styles";

type AddGalleryTileProps = {
  title: string;
  description: string;
  is_disabled: boolean;
  on_add: () => void;
};

export const AddGalleryTile = ({ title, description, is_disabled, on_add }: AddGalleryTileProps) => (
  <AddTileButton data-tour="gallery_add" type="button" disabled={is_disabled} onClick={on_add}>
    <AddTileIcon>
      <Plus size={20} />
    </AddTileIcon>
    <AddTileTitle>{title}</AddTileTitle>
    <AddTileDescription>{description}</AddTileDescription>
  </AddTileButton>
);
