import { format_money } from "@/lib/money_formatter";
import { describe_installment_plan } from "../helpers/installment_plan_label";
import { PurchaseSummaryList, StatItem, SummaryLabel, SummaryValue } from "./couple_calculator_styles";
import type { ProportionalSplit } from "../helpers/proportional_split";

type PurchaseSummaryProps = {
  split: ProportionalSplit;
};

export const PurchaseSummary = ({ split }: PurchaseSummaryProps) => (
  <PurchaseSummaryList>
    <StatItem>
      <SummaryLabel>Total da compra</SummaryLabel>
      <SummaryValue>{format_money(split.purchase_amount)}</SummaryValue>
    </StatItem>
    <StatItem>
      <SummaryLabel>Pagamento</SummaryLabel>
      <SummaryValue>{describe_installment_plan(split.installment_count, split.installment_amount)}</SummaryValue>
    </StatItem>
  </PurchaseSummaryList>
);
