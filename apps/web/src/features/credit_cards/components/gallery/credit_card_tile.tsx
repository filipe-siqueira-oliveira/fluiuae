"use client";

import { EditableTile } from "@/components/gallery/editable_tile";
import { CreditCardFace } from "./credit_card_face";
import type { CreditCardDto } from "@/types/api";

type CreditCardTileProps = {
  credit_card: CreditCardDto;
  can_write: boolean;
  on_edit: (credit_card: CreditCardDto) => void;
  on_view_statements: (credit_card: CreditCardDto) => void;
};

export const CreditCardTile = ({ credit_card, can_write, on_edit, on_view_statements }: CreditCardTileProps) => (
  <EditableTile
    edit_label={`Editar cartão ${credit_card.name}`}
    can_edit={can_write}
    on_edit={() => on_edit(credit_card)}
  >
    <CreditCardFace credit_card={credit_card} on_view_statements={() => on_view_statements(credit_card)} />
  </EditableTile>
);
