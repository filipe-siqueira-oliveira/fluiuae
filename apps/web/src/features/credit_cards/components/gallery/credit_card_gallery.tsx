"use client";

import { AddGalleryTile } from "@/components/gallery/add_gallery_tile";
import { PanelHeading } from "@/components/feedback/panel_heading";
import { GalleryGrid } from "@/components/gallery/gallery_styles";
import { CreditCardTile } from "./credit_card_tile";
import type { CreditCardDto } from "@/types/api";

type CreditCardGalleryProps = {
  credit_cards: CreditCardDto[];
  can_write: boolean;
  on_add: () => void;
  on_edit: (credit_card: CreditCardDto) => void;
  on_view_statements: (credit_card: CreditCardDto) => void;
};

const describe_card_count = (card_count: number): string =>
  card_count === 1 ? "1 cartão" : `${card_count} cartões`;

export const CreditCardGallery = ({
  credit_cards,
  can_write,
  on_add,
  on_edit,
  on_view_statements,
}: CreditCardGalleryProps) => (
  <>
    <PanelHeading title="Seus cartões" meta={describe_card_count(credit_cards.length)} />
    <GalleryGrid>
      {credit_cards.map((credit_card) => (
        <CreditCardTile
          key={credit_card.id}
          credit_card={credit_card}
          can_write={can_write}
          on_edit={on_edit}
          on_view_statements={on_view_statements}
        />
      ))}
      <AddGalleryTile
        title={credit_cards.length > 0 ? "Adicionar outro cartão" : "Adicionar cartão"}
        description="Limite, fechamento e fatura acompanhados aqui."
        is_disabled={!can_write}
        on_add={on_add}
      />
    </GalleryGrid>
  </>
);
