"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { App, Button } from "antd";
import { Plus } from "lucide-react";
import { TransactionType } from "@fluiuae/database/enums";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { FixedTransactionFormModal } from "./components/fixed_transaction_form_modal";
import { FixedTransactionList } from "./components/fixed_transaction_list";
import { FixedTransactionsSummaryRail } from "./components/fixed_transactions_summary_rail";
import {
  create_fixed_transaction_request,
  delete_fixed_transaction_request,
  update_fixed_transaction_request,
  type FixedTransactionPayload,
} from "./api/fixed_transactions_api";
import { read_fixed_transaction_copy, type FixedTransactionType } from "./helpers/fixed_transaction_copy";
import type { AccountDto, CategoryDto, CreditCardDto, FixedTransactionDto } from "@/types/api";

type FixedTransactionsViewProps = {
  type: FixedTransactionType;
  fixed_transactions: FixedTransactionDto[];
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  categories: CategoryDto[];
  can_write: boolean;
};

export const FixedTransactionsView = ({
  type,
  fixed_transactions,
  accounts,
  credit_cards,
  categories,
  can_write,
}: FixedTransactionsViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const copy = read_fixed_transaction_copy(type);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_item, set_selected_item] = useState<FixedTransactionDto | null>(null);
  const allows_credit_card = type === TransactionType.EXPENSE;
  const has_payment_sources = accounts.length > 0 || (allows_credit_card && credit_cards.length > 0);

  const open_create_modal = () => {
    set_selected_item(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (fixed_transaction: FixedTransactionDto) => {
    set_selected_item(fixed_transaction);
    set_is_modal_open(true);
  };

  const handle_submit = async (payload: FixedTransactionPayload) => {
    set_is_submitting(true);

    try {
      if (selected_item) {
        await update_fixed_transaction_request(selected_item.id, payload);
      } else {
        await create_fixed_transaction_request(type, payload);
      }

      set_is_modal_open(false);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (fixed_transaction: FixedTransactionDto) => {
    set_is_deleting(true);

    try {
      await delete_fixed_transaction_request(fixed_transaction.id);
      set_is_modal_open(false);
      message.success(`${copy.singular.charAt(0).toUpperCase()}${copy.singular.slice(1)} excluída`);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  return (
    <PageSection
      title={copy.title}
      tour_prefix="fixed"
      description={copy.description}
      intro={
        fixed_transactions.length > 0 ? (
          <FixedTransactionsSummaryRail fixed_transactions={fixed_transactions} copy={copy} />
        ) : undefined
      }
      actions={
        fixed_transactions.length === 0 ? undefined : (
          <Button
            type="primary"
            icon={<Plus size={16} />}
            disabled={!can_write || !has_payment_sources}
            onClick={open_create_modal}
          >
            {copy.create_button}
          </Button>
        )
      }
    >
      <FixedTransactionList
        fixed_transactions={fixed_transactions}
        copy={copy}
        can_write={can_write}
        can_create={has_payment_sources}
        on_create={open_create_modal}
        on_edit={open_edit_modal}
      />
      <FixedTransactionFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        title={selected_item ? copy.edit_modal_title : copy.create_modal_title}
        delete_label={copy.delete_label}
        delete_confirmation={copy.delete_confirmation}
        fixed_transaction={selected_item}
        accounts={accounts}
        credit_cards={credit_cards}
        allows_credit_card={allows_credit_card}
        category_kind={type}
        categories={categories}
        on_cancel={() => set_is_modal_open(false)}
        on_submit={handle_submit}
        on_delete={handle_delete}
      />
    </PageSection>
  );
};
