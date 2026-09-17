"use client";

import { useState } from "react";
import { App, Button, Spin } from "antd";
import styled from "styled-components";
import { Plus } from "lucide-react";
import { PageSection } from "@/components/feedback/page_section";
import { describe_request_error } from "@/lib/http_client";
import { EmptyState } from "@/components/feedback/empty_state";
import { media_mobile } from "@/styles/typography";
import { MonthSwitcher } from "./components/month_switcher";
import { TransactionDayList } from "./components/transaction_day_list";
import { TransactionFormModal } from "./components/transaction_form_modal";
import { TransactionToolbar } from "./components/transaction_toolbar";
import { TransactionsSummaryRail } from "./components/transactions_summary_rail";
import { format_month_name } from "./helpers/transaction_month";
import { use_transactions_list } from "./hooks/use_transactions_list";
import {
  create_transaction_request,
  delete_transaction_request,
  settle_transaction_request,
  update_transaction_request,
  type TransactionListResult,
  type TransactionPayload,
} from "./api/transactions_api";
import type { AccountDto, CategoryDto, CreditCardDto, TransactionDto } from "@/types/api";

const IntroStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media_mobile} {
    gap: 12px;
  }
`;

type TransactionsViewProps = {
  initial_result: TransactionListResult;
  accounts: AccountDto[];
  credit_cards: CreditCardDto[];
  categories: CategoryDto[];
  can_write: boolean;
};

export const TransactionsView = ({
  initial_result,
  accounts,
  credit_cards,
  categories,
  can_write,
}: TransactionsViewProps) => {
  const { message } = App.useApp();
  const list = use_transactions_list(initial_result);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [is_submitting, set_is_submitting] = useState(false);
  const [is_deleting, set_is_deleting] = useState(false);
  const [selected_transaction, set_selected_transaction] = useState<TransactionDto | null>(null);

  const open_create_modal = () => {
    set_selected_transaction(null);
    set_is_modal_open(true);
  };

  const open_edit_modal = (transaction: TransactionDto) => {
    set_selected_transaction(transaction);
    set_is_modal_open(true);
  };

  const run_request = async (action: () => Promise<void>) => {
    try {
      await action();
      await list.reload_current();
    } catch (error) {
      message.error(describe_request_error(error));
    }
  };

  const handle_submit = async (payload: TransactionPayload) => {
    set_is_submitting(true);

    try {
      if (selected_transaction) {
        await update_transaction_request(selected_transaction.id, payload);
      } else {
        await create_transaction_request(payload);
      }

      set_is_modal_open(false);
      await list.reload_current();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_delete = async (transaction: TransactionDto) => {
    set_is_deleting(true);

    try {
      await delete_transaction_request(transaction.id);
      set_is_modal_open(false);
      message.success("Lançamento excluído");
      await list.reload_current();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_deleting(false);
    }
  };

  const can_create = can_write && accounts.length + credit_cards.length > 0;
  const month_name = format_month_name(list.month);
  const has_filters = Boolean(list.filters.search || list.filters.type || list.filters.status || list.filters.account_id || list.filters.category_id);

  return (
    <PageSection
      title="Lançamentos"
      tour_prefix="transactions"
      description="Tudo o que entrou e saiu, mês a mês."
      intro={
        <IntroStack>
          <MonthSwitcher month={list.month} on_change={list.set_month} />
          <TransactionsSummaryRail summary={list.summary} month_name={month_name} />
        </IntroStack>
      }
      actions={
        <Button type="primary" icon={<Plus size={16} />} disabled={!can_create} onClick={open_create_modal}>
          Novo lançamento
        </Button>
      }
    >
      <TransactionToolbar
        filters={list.filters}
        accounts={accounts}
        categories={categories}
        on_change={list.set_filters}
      />
      <Spin spinning={list.is_loading}>
        {list.transactions.length === 0 ? (
          <EmptyState
            title={has_filters ? "Nada encontrado com esses filtros" : `Nada lançado em ${month_name}`}
            message={
              has_filters
                ? "Mude a busca ou limpe os filtros para ver outros lançamentos deste mês."
                : "Adicione o que entrou ou saiu. Despesas fixas e parcelas aparecem aqui sozinhas."
            }
            action={
              has_filters ? (
                <Button onClick={() => list.set_filters({})}>Limpar filtros</Button>
              ) : can_create ? (
                <Button type="primary" icon={<Plus size={16} />} onClick={open_create_modal}>
                  Novo lançamento
                </Button>
              ) : null
            }
          />
        ) : (
          <TransactionDayList
            transactions={list.transactions}
            can_write={can_write}
            on_edit={open_edit_modal}
            on_settle={(transaction) => run_request(() => settle_transaction_request(transaction.id))}
          />
        )}
      </Spin>
      <TransactionFormModal
        is_open={is_modal_open}
        is_submitting={is_submitting}
        is_deleting={is_deleting}
        transaction={selected_transaction}
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
