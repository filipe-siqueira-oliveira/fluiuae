"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";
import { PanelHeading } from "@/components/feedback/panel_heading";
import { sort_by_day, summarize_fixed_transactions } from "../helpers/fixed_transaction_schedule";
import { FixedTransactionRow } from "./fixed_transaction_row";
import { AgendaList } from "@/components/data/agenda_list_styles";
import { EmptyState } from "@/components/feedback/empty_state";
import type { read_fixed_transaction_copy } from "../helpers/fixed_transaction_copy";
import type { FixedTransactionDto } from "@/types/api";

type FixedTransactionListProps = {
  fixed_transactions: FixedTransactionDto[];
  copy: ReturnType<typeof read_fixed_transaction_copy>;
  can_write: boolean;
  can_create: boolean;
  on_create: () => void;
  on_edit: (fixed_transaction: FixedTransactionDto) => void;
};

export const FixedTransactionList = ({
  fixed_transactions,
  copy,
  can_write,
  can_create,
  on_create,
  on_edit,
}: FixedTransactionListProps) => {
  if (fixed_transactions.length === 0) {
    return (
      <EmptyState
        title={copy.empty_title}
        message={can_create ? copy.empty_message : copy.no_source_message}
        action={
          can_create ? (
            <Button type="primary" icon={<Plus size={16} />} disabled={!can_write} onClick={on_create}>
              {copy.create_button}
            </Button>
          ) : null
        }
      />
    );
  }

  const count_label =
    fixed_transactions.length === 1 ? `1 ${copy.singular}` : `${fixed_transactions.length} ${copy.plural}`;

  const next_id = summarize_fixed_transactions(fixed_transactions).next_item?.fixed_transaction.id ?? null;

  return (
    <>
      <PanelHeading title={copy.list_title} meta={`${count_label}`} />
      <AgendaList>
        {sort_by_day(fixed_transactions).map((fixed_transaction) => (
          <FixedTransactionRow
            key={fixed_transaction.id}
            fixed_transaction={fixed_transaction}
            is_next={fixed_transaction.id === next_id}
            can_write={can_write}
            on_edit={on_edit}
          />
        ))}
      </AgendaList>
    </>
  );
};
