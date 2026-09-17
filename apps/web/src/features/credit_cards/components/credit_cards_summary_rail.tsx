"use client";

import dayjs from "dayjs";
import { CalendarClock, CreditCard, Gauge } from "lucide-react";
import { SummaryRail } from "@/components/data/summary_rail";
import { format_money } from "@/lib/money_formatter";
import { resolve_credit_card_usage } from "../helpers/credit_card_usage";
import type { CreditCardDto } from "@/types/api";

type CreditCardsSummaryRailProps = {
  credit_cards: CreditCardDto[];
};

const find_next_due_card = (credit_cards: CreditCardDto[]): CreditCardDto | null =>
  [...credit_cards].sort(
    (first, second) => dayjs(first.open_statement_due_date).valueOf() - dayjs(second.open_statement_due_date).valueOf()
  )[0] ?? null;

export const CreditCardsSummaryRail = ({ credit_cards }: CreditCardsSummaryRailProps) => {
  const usages = credit_cards.map(resolve_credit_card_usage);
  const used_total = usages.reduce((total, usage) => total + usage.used_amount, 0);
  const available_total = usages.reduce((total, usage) => total + usage.available_amount, 0);
  const limit_total = credit_cards.reduce((total, credit_card) => total + Number(credit_card.credit_limit), 0);
  const next_due_card = find_next_due_card(credit_cards);
  const icon_size = 15;

  return (
    <SummaryRail
      items={[
        {
          key: "used",
          label: "Em uso nos cartões",
          icon: <CreditCard size={icon_size} strokeWidth={1.75} />,
          value: format_money(used_total),
          hint: "Compras de faturas ainda não pagas",
        },
        {
          key: "available",
          label: "Limite disponível",
          icon: <Gauge size={icon_size} strokeWidth={1.75} />,
          value: format_money(available_total),
          hint: `De ${format_money(limit_total)} somando os limites`,
        },
        {
          key: "next_due",
          label: "Próximo vencimento",
          icon: <CalendarClock size={icon_size} strokeWidth={1.75} />,
          value: next_due_card ? dayjs(next_due_card.open_statement_due_date).add(12, "hour").format("D [de] MMM") : "—",
          hint: next_due_card ? `Fatura do ${next_due_card.name}` : "Nenhum cartão cadastrado",
        },
      ]}
    />
  );
};
