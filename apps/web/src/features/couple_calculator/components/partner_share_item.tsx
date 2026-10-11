import { format_money } from "@/lib/money_formatter";
import { format_income_share } from "../helpers/income_share_formatter";
import { is_paid_in_installments } from "../helpers/installment_plan_label";
import {
  AmountUnit,
  PartnerAmount,
  PartnerCaption,
  PartnerDot,
  PartnerLabel,
  StatItem,
} from "./couple_calculator_styles";
import type { PartnerShare } from "../helpers/proportional_split";

type PartnerShareItemProps = {
  label: string;
  color: string;
  share: PartnerShare;
  installment_count: number;
};

export const PartnerShareItem = ({ label, color, share, installment_count }: PartnerShareItemProps) => {
  const is_installment_plan = is_paid_in_installments(installment_count);

  return (
    <StatItem>
      <PartnerLabel>
        <PartnerDot $color={color} />
        {label}
      </PartnerLabel>
      <PartnerAmount>
        {format_money(is_installment_plan ? share.installment_amount : share.total_amount)}
        {is_installment_plan ? <AmountUnit>por parcela</AmountUnit> : null}
      </PartnerAmount>
      {is_installment_plan ? <PartnerCaption>{format_money(share.total_amount)} no total</PartnerCaption> : null}
      <PartnerCaption>{format_income_share(share.income_share)} da renda do casal</PartnerCaption>
    </StatItem>
  );
};
