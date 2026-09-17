"use client";

import { TileEditButton, TileFrame } from "./gallery_styles";

type EditableTileProps = {
  edit_label: string;
  can_edit: boolean;
  on_edit: () => void;
  children: React.ReactNode;
};

export const EditableTile = ({ edit_label, can_edit, on_edit, children }: EditableTileProps) => (
  <TileFrame>
    {can_edit ? <TileEditButton type="button" aria-label={edit_label} onClick={on_edit} /> : null}
    {children}
  </TileFrame>
);
