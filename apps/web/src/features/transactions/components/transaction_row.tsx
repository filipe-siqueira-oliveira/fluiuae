"use client";

import { Button } from "antd";
import { TransactionStatus, TransactionType } from "@fluiuae/database/enums";
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Check } from "lucide-react";
import { StatusPill } from "@/components/data/status_pill";
import {
  describe_transaction_meta,
  format_signed_amount,
  resolve_amount_color,
  resolve_icon_color,
  resolve_status_badge,
} from "../helpers/transaction_presentation";
import {
  StatusActions,
  RowAmount,
  RowButton,
  RowDescription,
  RowItem,
  RowMeta,
  RowText,
  RowValue,
  TypeIcon,
} from "./transaction_row_styles";
import type { TransactionDto } from "@/types/api";

type TransactionRowProps = {
  transaction: TransactionDto;
  can_write: boolean;
  on_edit: (transaction: TransactionDto) => void;
  on_settle: (transaction: TransactionDto) => void;
};

const type_icons = {
  [TransactionType.INCOME]: ArrowDownLeft,
  [TransactionType.EXPENSE]: ArrowUpRight,
  [TransactionType.TRANSFER]: ArrowLeftRight,
};

const activation_keys = new Set(["Enter", " "]);

export const TransactionRow = ({ transaction, can_write, on_edit, on_settle }: TransactionRowProps) => {
  const Icon = type_icons[transaction.type];
  const is_pending = transaction.status === TransactionStatus.PENDING;
  const status_badge = resolve_status_badge(transaction);

  return (
    <RowItem>
      <RowButton
        role={can_write ? "button" : undefined}
        tabIndex={can_write ? 0 : undefined}
        aria-label={can_write ? `Editar ${transaction.description}` : undefined}
        $is_clickable={can_write}
        onClick={(event) => {
          if (can_write && !(event.target as HTMLElement).closest("[data-row-control]")) {
            on_edit(transaction);
          }
        }}
        onKeyDown={(event) => {
          if (can_write && event.target === event.currentTarget && activation_keys.has(event.key)) {
            event.preventDefault();
            on_edit(transaction);
          }
        }}
      >
        <TypeIcon $color={resolve_icon_color(transaction)} aria-hidden="true">
          <Icon size={18} strokeWidth={2} />
        </TypeIcon>
        <RowText>
          <RowDescription title={transaction.description}>{transaction.description}</RowDescription>
          <RowMeta title={describe_transaction_meta(transaction)}>
            {describe_transaction_meta(transaction)}
          </RowMeta>
        </RowText>
        <RowValue>
          <RowAmount $color={resolve_amount_color(transaction)} $is_pending={is_pending}>
            {format_signed_amount(transaction)}
          </RowAmount>
        </RowValue>
        {status_badge ? (
          <StatusActions>
            <StatusPill tone={status_badge.tone}>{status_badge.label}</StatusPill>
            {can_write && status_badge.can_settle ? (
              <Button
                data-row-control
                size="small"
                type="text"
                icon={<Check size={14} />}
                aria-label={`Marcar ${transaction.description} como efetivado`}
                onClick={() => on_settle(transaction)}
              >
                Efetivar
              </Button>
            ) : null}
          </StatusActions>
        ) : null}
      </RowButton>
    </RowItem>
  );
};
