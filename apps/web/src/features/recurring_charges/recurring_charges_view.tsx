"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button } from "antd";
import { Plus } from "lucide-react";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { RecurringChargeFormModal } from "./components/recurring_charge_form_modal";
import { RecurringChargeList } from "./components/recurring_charge_list";
import { RecurringChargesSummaryRail } from "./components/recurring_charges_summary_rail";
import {
  create_recurring_charge_request,
  delete_recurring_charge_request,
  update_recurring_charge_request,
} from "./api/recurring_charges_api";
import {
  to_create_recurring_charge_payload,
  to_recurring_charge_payload,
  type RecurringChargeFormValues,
} from "./helpers/recurring_charge_form_values";
import type { AccountDto, CategoryDto, CreditCardDto, RecurringChargeDto } from "@/types/api";

type RecurringChargesViewProps = {
  recurring_charges: RecurringChargeDto[];
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  categories: CategoryDto[];
  can_write: boolean;
};

export const RecurringChargesView = ({
  recurring_charges,
  accounts,
  credit_cards,
  categories,
  can_write,
}: RecurringChargesViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_item, set_selected_item] = useState<RecurringChargeDto | null>(null);

  const open_create_modal = () => {
    set_selected_item(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (recurring_charge: RecurringChargeDto) => {
    set_selected_item(recurring_charge);
    set_is_modal_open(true);
  };

  const handle_submit = async (values: RecurringChargeFormValues) => {
    set_is_submitting(true);

    try {
      if (selected_item) {
        await update_recurring_charge_request(selected_item.id, to_recurring_charge_payload(values));
      } else {
        await create_recurring_charge_request(to_create_recurring_charge_payload(values));
      }

      set_is_modal_open(false);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (recurring_charge: RecurringChargeDto) => {
    set_is_deleting(true);

    try {
      await delete_recurring_charge_request(recurring_charge.id);
      set_is_modal_open(false);
      message.success("Recorrência excluída");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  const has_payment_sources = accounts.length + credit_cards.length > 0;

  return (
    <PageSection
      title="Recorrências"
      tour_prefix="recurring"
      description="Compras parceladas e cobranças com data para acabar. Cada parcela vira um lançamento previsto no mês dela."
      intro={
        recurring_charges.length > 0 ? <RecurringChargesSummaryRail recurring_charges={recurring_charges} /> : undefined
      }
      actions={
        recurring_charges.length === 0 ? undefined : (
          <Button
            type="primary"
            icon={<Plus size={16} />}
            disabled={!can_write || !has_payment_sources}
            onClick={open_create_modal}
          >
            Nova recorrência
          </Button>
        )
      }
    >
      <RecurringChargeList
        recurring_charges={recurring_charges}
        can_write={can_write}
        can_create={has_payment_sources}
        on_create={open_create_modal}
        on_edit={open_edit_modal}
      />
      <RecurringChargeFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        recurring_charge={selected_item}
        accounts={accounts}
        credit_cards={credit_cards}
        categories={categories}
        on_cancel={() => set_is_modal_open(false)}
        on_submit={handle_submit}
        on_delete={handle_delete}
      />
    </PageSection>
  );
};
