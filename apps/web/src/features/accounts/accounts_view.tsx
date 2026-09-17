"use client";

import { useState } from "react";
import { App, Button } from "antd";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { AccountFormModal } from "./components/account_form_modal";
import { AccountsSummaryRail } from "./components/accounts_summary_rail";
import { AccountGallery } from "./components/gallery/account_gallery";
import {
  create_account_request,
  delete_account_request,
  update_account_request,
  type AccountPayload,
} from "./api/accounts_api";
import type { AccountDto, AccountsSummaryDto } from "@/types/api";

type AccountsViewProps = {
  accounts: AccountDto[];
  summary: AccountsSummaryDto;
  can_write: boolean;
};

export const AccountsView = ({ accounts, summary, can_write }: AccountsViewProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_account, set_selected_account] = useState<AccountDto | null>(null);

  const open_create_modal = () => {
    set_selected_account(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (account: AccountDto) => {
    set_selected_account(account);
    set_is_modal_open(true);
  };

  const handle_submit = async (payload: AccountPayload) => {
    set_is_submitting(true);

    try {
      if (selected_account) {
        await update_account_request(selected_account.id, payload);
      } else {
        await create_account_request(payload);
      }

      set_is_modal_open(false);
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (account: AccountDto) => {
    set_is_deleting(true);

    try {
      await delete_account_request(account.id);
      set_is_modal_open(false);
      message.success("Conta excluída");
      router.refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  return (
    <PageSection
      title="Contas bancárias"
      tour_prefix="accounts"
      description="Onde seu dinheiro fica e quanto entrou e saiu de cada conta neste mês."
      is_panel_flush_on_mobile
      intro={<AccountsSummaryRail summary={summary} account_count={accounts.length} />}
      actions={
        <Button type="primary" icon={<Plus size={16} />} disabled={!can_write} onClick={open_create_modal}>
          Nova conta
        </Button>
      }
    >
      <AccountGallery
        accounts={accounts}
        can_write={can_write}
        on_add={open_create_modal}
        on_edit={open_edit_modal}
      />
      <AccountFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        account={selected_account}
        on_cancel={() => set_is_modal_open(false)}
        on_submit={handle_submit}
        on_delete={handle_delete}
      />
    </PageSection>
  );
};
