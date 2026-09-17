"use client";

import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { WidgetCard } from "../components/widget_card";
import { Dot, ItemAmount, ItemIdentity, ItemList, ItemRow, ItemTitle, MeterFill, MeterTrack, WidgetEmpty } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const PaymentMethodsWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const account_total = Number(dashboard.payment_methods.account_total);
  const card_total = Number(dashboard.payment_methods.card_total);
  const total = account_total + card_total;
  const methods = [
    { key: "account", label: "Conta (débito, pix, boleto)", amount: account_total, color: theme_tokens.colors.chart_income },
    { key: "card", label: "Cartão de crédito", amount: card_total, color: theme_tokens.colors.chart_expense },
  ];

  return (
    <WidgetCard title="Conta ou cartão" subtitle="Como as despesas do mês foram pagas">
      {total === 0 ? (
        <WidgetEmpty>Nenhuma despesa neste mês ainda.</WidgetEmpty>
      ) : (
        <>
          <MeterTrack style={{ height: 12, marginTop: 4 }} aria-hidden="true">
            {methods.map((method) => (
              <MeterFill key={method.key} $share={method.amount / total} $color={method.color} />
            ))}
          </MeterTrack>
          <ItemList style={{ marginTop: 8 }}>
            {methods.map((method) => (
              <ItemRow key={method.key}>
                <ItemIdentity>
                  <Dot $color={method.color} aria-hidden="true" />
                  <ItemTitle>{method.label}</ItemTitle>
                </ItemIdentity>
                <ItemAmount>
                  {format_money(method.amount)}, {Math.round((method.amount / total) * 100)}%
                </ItemAmount>
              </ItemRow>
            ))}
          </ItemList>
        </>
      )}
    </WidgetCard>
  );
};
