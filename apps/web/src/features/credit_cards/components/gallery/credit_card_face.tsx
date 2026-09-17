"use client";

import { ReceiptText } from "lucide-react";
import { format_money } from "@/lib/money_formatter";
import { describe_days_until, format_next_date } from "../../helpers/credit_card_dates";
import { resolve_credit_card_usage } from "../../helpers/credit_card_usage";
import { CreditCardChip } from "./credit_card_chip";
import {
  FaceAmount,
  FaceAmountBlock,
  FaceAmountRow,
  FaceBottom,
  FaceBrand,
  FaceCycle,
  FaceFrame,
  FaceInstitution,
  FaceActionButton,
  FaceLabel,
  FaceName,
  FaceTag,
  FaceTop,
} from "@/components/gallery/finance_card_face_styles";
import { UsageFill, UsageLegend, UsageTrack } from "./credit_card_usage_styles";
import type { CreditCardDto } from "@/types/api";

type CreditCardFaceProps = {
  credit_card: CreditCardDto;
  on_view_statements: () => void;
};

const describe_closing = (next_closing_date: string): string => {
  const days_until = describe_days_until(next_closing_date);

  return `Fecha ${days_until}`;
};

export const CreditCardFace = ({ credit_card, on_view_statements }: CreditCardFaceProps) => {
  const usage = resolve_credit_card_usage(credit_card);

  return (
    <FaceFrame>
      <FaceTop>
        <CreditCardChip />
        <FaceBrand>
          {credit_card.institution ? <FaceInstitution>{credit_card.institution}</FaceInstitution> : null}
          {credit_card.is_default ? <FaceTag>Cartão padrão</FaceTag> : null}
        </FaceBrand>
      </FaceTop>
      <FaceBottom>
        <FaceAmountRow>
          <FaceAmountBlock>
            <FaceActionButton
              data-tour="cards_statements"
              type="button"
              onClick={on_view_statements}
              aria-label={`Ver faturas do cartão ${credit_card.name}`}
            >
              <ReceiptText size={14} />
              Faturas
            </FaceActionButton>
            <FaceLabel>Em uso agora</FaceLabel>
            <FaceAmount>{format_money(usage.used_amount)}</FaceAmount>
          </FaceAmountBlock>
          <FaceCycle>
            {describe_closing(credit_card.next_closing_date)}, vence {format_next_date(credit_card.open_statement_due_date)}
          </FaceCycle>
        </FaceAmountRow>
        <FaceName title={credit_card.name}>{credit_card.name}</FaceName>
        <UsageTrack
          role="meter"
          aria-label="Limite usado"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={usage.used_percent}
        >
          <UsageFill $ratio={usage.used_ratio} $level={usage.level} />
        </UsageTrack>
        <UsageLegend>
          <span>usado {format_money(usage.used_amount)}</span>
          <span>
            disponível {format_money(usage.available_amount)}, {usage.used_percent}%
          </span>
        </UsageLegend>
      </FaceBottom>
    </FaceFrame>
  );
};
