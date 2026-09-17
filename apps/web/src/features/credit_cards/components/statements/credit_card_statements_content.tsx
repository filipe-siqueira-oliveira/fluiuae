"use client";

import { useState } from "react";
import { App, Spin } from "antd";
import { useRouter } from "next/navigation";
import { describe_request_error } from "@/lib/http_client";
import {
  pay_statement_request,
  undo_statement_payment_request,
  type StatementPaymentPayload,
} from "../../api/credit_card_statements_api";
import { pick_initial_statement_key } from "../../helpers/statement_status_labels";
import { use_credit_card_commitments } from "../../hooks/use_credit_card_commitments";
import { use_credit_card_statements } from "../../hooks/use_credit_card_statements";
import { StatementDetail } from "./statement_detail";
import { StatementList } from "./statement_list";
import { StatementOverview } from "./statement_overview";
import { SideColumn } from "./statement_side_styles";
import { StatementPaymentModal } from "./statement_payment_modal";
import { StatementMessage, StatementsLayout } from "./statements_modal_styles";
import type { AccountDto, CreditCardDto, CreditCardStatementDetailDto } from "@/types/api";

type CreditCardStatementsContentProps = {
  credit_card: CreditCardDto;
  accounts: AccountDto[];
  can_write: boolean;
};

export const CreditCardStatementsContent = ({ credit_card, accounts, can_write }: CreditCardStatementsContentProps) => {
  const router = useRouter();
  const { message } = App.useApp();
  const { statements, error_message, reload } = use_credit_card_statements(
    credit_card.id,
    `${credit_card.statement_closing_day}:${credit_card.payment_due_day}`
  );
  const commitments = use_credit_card_commitments(credit_card.id, credit_card.statement_closing_day.toString());
  const [chosen_key, set_chosen_key] = useState<string | null>(null);
  const [paying_statement, set_paying_statement] = useState<CreditCardStatementDetailDto | null>(null);
  const [is_submitting, set_is_submitting] = useState(false);

  const refresh = () => {
    reload();
    router.refresh();
  };

  const handle_pay = async (payload: StatementPaymentPayload) => {
    if (!paying_statement) {
      return;
    }

    set_is_submitting(true);

    try {
      await pay_statement_request(credit_card.id, paying_statement.statement_key, payload);
      message.success("Fatura paga");
      set_paying_statement(null);
      refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    } finally {
      set_is_submitting(false);
    }
  };

  const handle_undo = async (statement: CreditCardStatementDetailDto) => {
    try {
      await undo_statement_payment_request(credit_card.id, statement.statement_key);
      message.success("Pagamento desfeito");
      refresh();
    } catch (error) {
      message.error(describe_request_error(error));
    }
  };

  if (error_message) {
    return <StatementMessage>Não foi possível carregar as faturas: {error_message}</StatementMessage>;
  }

  if (!statements) {
    return (
      <StatementMessage aria-busy="true">
        <Spin size="small" /> Carregando faturas...
      </StatementMessage>
    );
  }

  const ordered_statements = [...statements].reverse();
  const selected_key = chosen_key ?? pick_initial_statement_key(statements);
  const selected_statement = statements.find((statement) => statement.statement_key === selected_key);

  return (
    <StatementsLayout>
      <SideColumn>
        <StatementList statements={ordered_statements} selected_key={selected_key} on_select={set_chosen_key} />
        {selected_statement ? (
          <StatementOverview
            statement={selected_statement}
            commitments={commitments}
            can_write={can_write}
            on_pay={set_paying_statement}
            on_undo={handle_undo}
          />
        ) : null}
      </SideColumn>
      {selected_statement ? (
        <StatementDetail key={selected_statement.statement_key} statement={selected_statement} />
      ) : null}
      <StatementPaymentModal
        statement={paying_statement}
        accounts={accounts}
        is_submitting={is_submitting}
        on_cancel={() => set_paying_statement(null)}
        on_submit={handle_pay}
      />
    </StatementsLayout>
  );
};
