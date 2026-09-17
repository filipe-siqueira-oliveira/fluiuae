"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button } from "antd";
import { Plus } from "lucide-react";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { CreditCardFormModal } from "./components/credit_card_form_modal";
import { CreditCardsSummaryRail } from "./components/credit_cards_summary_rail";
import { CreditCardGallery } from "./components/gallery/credit_card_gallery";
import { CreditCardStatementsModal } from "./components/statements/credit_card_statements_modal";
import {
  create_credit_card_request,
  delete_credit_card_request,
  update_credit_card_request,
  type CreditCardPayload,
} from "./api/credit_cards_api";
import type { AccountDto, CreditCardDto } from "@/types/api";

type CreditCardsViewProps = {
  credit_cards: CreditCardDto[];
  accounts: AccountDto[];
  can_write: boolean;
};

export const CreditCardsView = ({ credit_cards, accounts, can_write }: CreditCardsViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_card, set_selected_card] = useState<CreditCardDto | null>(null);
  const [statements_card, set_statements_card] = useState<CreditCardDto | null>(null);

  const open_create_modal = () => {
    set_selected_card(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (credit_card: CreditCardDto) => {
    set_selected_card(credit_card);
    set_is_modal_open(true);
  };

  const handle_submit = async (payload: CreditCardPayload) => {
    set_is_submitting(true);

    try {
      if (selected_card) {
        await update_credit_card_request(selected_card.id, payload);
      } else {
        await create_credit_card_request(payload);
      }

      set_is_modal_open(false);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (credit_card: CreditCardDto) => {
    set_is_deleting(true);

    try {
      await delete_credit_card_request(credit_card.id);
      set_is_modal_open(false);
      message.success("Cartão excluído");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  return (
    <PageSection
      title="Cartões e faturas"
      tour_prefix="cards"
      description="Quanto do limite está em uso e quando cada fatura fecha e vence."
      is_panel_flush_on_mobile
      intro={credit_cards.length > 0 ? <CreditCardsSummaryRail credit_cards={credit_cards} /> : undefined}
      actions={
        <Button type="primary" icon={<Plus size={16} />} disabled={!can_write} onClick={open_create_modal}>
          Novo cartão
        </Button>
      }
    >
      <CreditCardGallery
        credit_cards={credit_cards}
        can_write={can_write}
        on_add={open_create_modal}
        on_edit={open_edit_modal}
        on_view_statements={set_statements_card}
      />
      <CreditCardFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        credit_card={selected_card}
        on_cancel={() => set_is_modal_open(false)}
        on_submit={handle_submit}
        on_delete={handle_delete}
      />
      <CreditCardStatementsModal
        credit_card={statements_card}
        accounts={accounts}
        can_write={can_write}
        on_close={() => set_statements_card(null)}
      />
    </PageSection>
  );
};
