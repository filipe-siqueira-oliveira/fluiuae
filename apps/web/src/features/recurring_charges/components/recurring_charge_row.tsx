"use client";

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
import { ProgressRing, type ProgressRingTone } from "@/components/data/progress_ring";
import { CategoryOptionLabel } from "@/features/categories/components/category_option_label";
import { PaymentSourceCell } from "@/features/payment_sources/components/payment_source_cell";
import { format_money } from "@/lib/money_formatter";
import {
  format_charge_month,
  remaining_installments,
  resolve_charge_phase,
  type RecurringChargePhase,
} from "../helpers/recurring_charge_schedule";
import type { RecurringChargeDto } from "@/types/api";

type RecurringChargeRowProps = {
  recurring_charge: RecurringChargeDto;
  can_write: boolean;
  on_edit: (recurring_charge: RecurringChargeDto) => void;
};

const ring_tones: Record<RecurringChargePhase, ProgressRingTone> = {
  active: "active",
  upcoming: "waiting",
  finished: "done",
};

const describe_period = (recurring_charge: RecurringChargeDto, phase: RecurringChargePhase): string => {
  if (phase === "upcoming") {
    return `Começa em ${format_charge_month(recurring_charge.starts_at_month)}`;
  }

  return phase === "finished"
    ? `Terminou em ${format_charge_month(recurring_charge.ends_at_month)}`
    : `Até ${format_charge_month(recurring_charge.ends_at_month)}`;
};

const describe_remaining = (recurring_charge: RecurringChargeDto, phase: RecurringChargePhase): string => {
  if (phase === "finished") {
    return "Concluída";
  }

  const count = remaining_installments(recurring_charge);

  return count === 0 ? "Última parcela" : `Falta ${format_money(recurring_charge.remaining_amount)}`;
};

export const RecurringChargeRow = ({ recurring_charge, can_write, on_edit }: RecurringChargeRowProps) => {
  const phase = resolve_charge_phase(recurring_charge);

  return (
    <AgendaRowItem>
      <AgendaRowButton
        type="button"
        disabled={!can_write}
        aria-label={`Editar ${recurring_charge.description}`}
        onClick={() => on_edit(recurring_charge)}
        style={phase === "finished" ? { opacity: 0.72 } : undefined}
      >
        <ProgressRing
          value={recurring_charge.generated_count}
          total={recurring_charge.installment_count}
          tone={ring_tones[phase]}
          label={`${recurring_charge.generated_count} de ${recurring_charge.installment_count} parcelas lançadas`}
        />
        <AgendaText>
          <AgendaDescription title={recurring_charge.description}>{recurring_charge.description}</AgendaDescription>
          <AgendaMeta>
            {recurring_charge.category ? (
              <CategoryOptionLabel name={recurring_charge.category.name} color={recurring_charge.category.color} />
            ) : (
              <span>Sem categoria</span>
            )}
            <PaymentSourceCell source={recurring_charge} />
            {recurring_charge.is_automatic_debit ? <span>Débito automático</span> : null}
            <span>{describe_period(recurring_charge, phase)}</span>
          </AgendaMeta>
        </AgendaText>
        <AgendaValue>
          <AgendaAmount>{format_money(recurring_charge.installment_amount)}</AgendaAmount>
          <AgendaCaption $is_highlighted={phase === "active" && remaining_installments(recurring_charge) <= 1}>
            {describe_remaining(recurring_charge, phase)}
          </AgendaCaption>
        </AgendaValue>
      </AgendaRowButton>
    </AgendaRowItem>
  );
};
