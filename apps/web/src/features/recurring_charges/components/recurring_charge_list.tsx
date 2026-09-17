"use client";

import { Button } from "antd";
import { Plus } from "lucide-react";
import styled from "styled-components";
import { AgendaList } from "@/components/data/agenda_list_styles";
import { EmptyState } from "@/components/feedback/empty_state";
import { PanelHeading } from "@/components/feedback/panel_heading";
import { theme_tokens } from "@/styles/theme_tokens";
import { label_text } from "@/styles/typography";
import { split_recurring_charges } from "../helpers/recurring_charge_schedule";
import { RecurringChargeRow } from "./recurring_charge_row";
import type { RecurringChargeDto } from "@/types/api";

const GroupTitle = styled.h3`
  ${label_text}
  margin-top: 24px;
  padding-bottom: 4px;
  color: ${theme_tokens.colors.text};
  font-weight: 600;
`;

type RecurringChargeListProps = {
  recurring_charges: RecurringChargeDto[];
  can_write: boolean;
  can_create: boolean;
  on_create: () => void;
  on_edit: (recurring_charge: RecurringChargeDto) => void;
};

const describe_count = (count: number): string => (count === 1 ? "1 recorrência" : `${count} recorrências`);

export const RecurringChargeList = ({
  recurring_charges,
  can_write,
  can_create,
  on_create,
  on_edit,
}: RecurringChargeListProps) => {
  if (recurring_charges.length === 0) {
    return (
      <EmptyState
        title="Nenhuma recorrência ainda"
        message={
          can_create
            ? "Cadastre compras parceladas ou cobranças com fim, como um curso de 12 meses. Cada parcela aparece no mês dela."
            : "Cadastre uma conta bancária ou um cartão antes de adicionar recorrências."
        }
        action={
          can_create ? (
            <Button type="primary" icon={<Plus size={16} />} disabled={!can_write} onClick={on_create}>
              Nova recorrência
            </Button>
          ) : null
        }
      />
    );
  }

  const { ongoing, finished } = split_recurring_charges(recurring_charges);
  const render_rows = (items: RecurringChargeDto[]) => (
    <AgendaList>
      {items.map((recurring_charge) => (
        <RecurringChargeRow
          key={recurring_charge.id}
          recurring_charge={recurring_charge}
          can_write={can_write}
          on_edit={on_edit}
        />
      ))}
    </AgendaList>
  );

  return (
    <>
      <PanelHeading title="Suas recorrências" meta={`${describe_count(recurring_charges.length)}, da que termina primeiro`} />
      {ongoing.length > 0 ? (
        <>
          {finished.length > 0 ? <GroupTitle>Em andamento</GroupTitle> : null}
          {render_rows(ongoing)}
        </>
      ) : null}
      {finished.length > 0 ? (
        <>
          <GroupTitle>Concluídas</GroupTitle>
          {render_rows(finished)}
        </>
      ) : null}
    </>
  );
};
