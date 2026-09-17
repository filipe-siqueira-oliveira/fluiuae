"use client";

import { useEffect, useRef } from "react";
import { format_money } from "@/lib/money_formatter";
import { format_statement_short_month } from "../../helpers/statement_labels";
import { describe_statement_list_state, resolve_statement_list_tone } from "../../helpers/statement_status_labels";
import { StatementRowAmount, StatementRowButton, StatementRowLabel, StatementRows } from "./statement_side_styles";
import type { CreditCardStatementDetailDto } from "@/types/api";

type StatementListProps = {
  statements: CreditCardStatementDetailDto[];
  selected_key: string | null;
  on_select: (statement_key: string) => void;
};

export const StatementList = ({ statements, selected_key, on_select }: StatementListProps) => {
  const list_ref = useRef<HTMLUListElement | null>(null);
  const selected_ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const list = list_ref.current;
    const selected = selected_ref.current;

    if (list && selected) {
      list.scrollTop = selected.offsetTop - list.clientHeight + selected.offsetHeight;
    }
  }, []);

  return (
    <nav aria-label="Faturas do cartão">
      <StatementRows ref={list_ref}>
        {statements.map((statement) => {
          const is_selected = statement.statement_key === selected_key;
          const tone = resolve_statement_list_tone(statement);

          return (
            <li key={statement.statement_key}>
              <StatementRowButton
                ref={is_selected ? selected_ref : undefined}
                type="button"
                $tone={tone}
                $is_selected={is_selected}
                aria-current={is_selected ? "true" : undefined}
                onClick={() => on_select(statement.statement_key)}
              >
                <StatementRowLabel $tone={tone}>
                  {format_statement_short_month(statement.due_date)} · {describe_statement_list_state(statement)}
                </StatementRowLabel>
                <StatementRowAmount>{format_money(statement.total)}</StatementRowAmount>
              </StatementRowButton>
            </li>
          );
        })}
      </StatementRows>
    </nav>
  );
};
