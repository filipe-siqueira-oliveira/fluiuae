"use client";

import { TransactionType } from "@fluiuae/database/enums";
import { CategoryOptionLabel } from "@/features/categories/components/category_option_label";
import { PaymentSourceCell } from "@/features/payment_sources/components/payment_source_cell";
import { format_money } from "@/lib/money_formatter";
import { describe_timing, resolve_fixed_transaction_timing } from "../helpers/fixed_transaction_schedule";
import {
  AgendaAmount,
  AgendaCaption,
  AgendaDescription,
  AgendaMeta,
  AgendaRowButton,
  AgendaRowItem,
  AgendaText,
  AgendaValue,
} from "@/components/data/agenda_list_styles";
import { DayBadge, DayBadgeLabel, DayBadgeNumber, type DayBadgeState } from "./day_badge_styles";
import type { FixedTransactionDto } from "@/types/api";

type FixedTransactionRowProps = {
  fixed_transaction: FixedTransactionDto;
  is_next: boolean;
  can_write: boolean;
  on_edit: (fixed_transaction: FixedTransactionDto) => void;
};

export const FixedTransactionRow = ({ fixed_transaction, is_next, can_write, on_edit }: FixedTransactionRowProps) => {
  const timing = resolve_fixed_transaction_timing(fixed_transaction);
  const state: DayBadgeState = is_next ? "next" : timing.has_passed ? "passed" : "upcoming";

  return (
    <AgendaRowItem>
      <AgendaRowButton
        type="button"
        disabled={!can_write}
        aria-label={`Editar ${fixed_transaction.description}`}
        onClick={() => on_edit(fixed_transaction)}
      >
        <DayBadge $state={state} aria-hidden="true">
          <DayBadgeLabel>dia</DayBadgeLabel>
          <DayBadgeNumber>{fixed_transaction.day_of_month}</DayBadgeNumber>
        </DayBadge>
        <AgendaText>
          <AgendaDescription title={fixed_transaction.description}>{fixed_transaction.description}</AgendaDescription>
          <AgendaMeta>
            {fixed_transaction.category ? (
              <CategoryOptionLabel name={fixed_transaction.category.name} color={fixed_transaction.category.color} />
            ) : (
              <span>Sem categoria</span>
            )}
            <PaymentSourceCell source={fixed_transaction} />
            {fixed_transaction.is_automatic_debit ? (
              <span>{fixed_transaction.type === TransactionType.INCOME ? "Entra sozinha no dia" : "Débito automático"}</span>
            ) : null}
          </AgendaMeta>
        </AgendaText>
        <AgendaValue>
          <AgendaAmount>{format_money(fixed_transaction.amount)}</AgendaAmount>
          <AgendaCaption $is_highlighted={state === "next"}>{is_next ? `Próxima, ${describe_timing(timing).toLowerCase()}` : describe_timing(timing)}</AgendaCaption>
        </AgendaValue>
      </AgendaRowButton>
    </AgendaRowItem>
  );
};
