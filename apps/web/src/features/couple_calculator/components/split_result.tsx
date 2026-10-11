import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { PartnerShareItem } from "./partner_share_item";
import { PurchaseSummary } from "./purchase_summary";
import { ResultFootnote, ResultHeading, ResultPanel, SplitBar, SplitSegment, StatList } from "./couple_calculator_styles";
import type { ProportionalSplit } from "../helpers/proportional_split";

const { colors } = theme_tokens;

const partner_colors = {
  first: colors.primary,
  second: colors.pending,
};

type SplitResultProps = {
  split: ProportionalSplit;
};

export const SplitResult = ({ split }: SplitResultProps) => (
  <ResultPanel aria-live="polite">
    <PurchaseSummary split={split} />
    <ResultHeading>Cada um paga</ResultHeading>
    <SplitBar>
      <SplitSegment $share={split.first_partner.income_share} $color={partner_colors.first} />
      <SplitSegment $share={split.second_partner.income_share} $color={partner_colors.second} />
    </SplitBar>
    <StatList>
      <PartnerShareItem
        label="Pessoa 1"
        color={partner_colors.first}
        share={split.first_partner}
        installment_count={split.installment_count}
      />
      <PartnerShareItem
        label="Pessoa 2"
        color={partner_colors.second}
        share={split.second_partner}
        installment_count={split.installment_count}
      />
    </StatList>
    <ResultFootnote>
      Proporcional à renda somada de {format_money(split.household_income)}.
      {split.has_rounded_installments ? " Valores por parcela arredondados para o centavo." : ""}
    </ResultFootnote>
  </ResultPanel>
);
