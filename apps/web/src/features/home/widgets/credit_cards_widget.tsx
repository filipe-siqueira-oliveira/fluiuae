"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { format_money } from "@/lib/money_formatter";
import { theme_tokens } from "@/styles/theme_tokens";
import { WidgetCard } from "../components/widget_card";
import {
  ItemAmount,
  ItemList,
  ItemMeta,
  ItemRow,
  ItemText,
  ItemTitle,
  MeterFill,
  MeterTrack,
  WidgetEmpty,
} from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

const usage_color = (ratio: number): string =>
  ratio > 1 ? theme_tokens.colors.danger : ratio >= 0.8 ? theme_tokens.colors.pending : theme_tokens.colors.primary;

export const CreditCardsWidget = ({ dashboard }: { dashboard: DashboardDto }) => (
  <WidgetCard title="Cartões" subtitle="Fatura aberta e limite usado">
    {dashboard.credit_cards.length === 0 ? (
      <WidgetEmpty>
        Nenhum cartão ainda. <Link href="/cards">Cadastre um cartão</Link>.
      </WidgetEmpty>
    ) : (
      <ItemList>
        {dashboard.credit_cards.map((card) => {
          const limit = Number(card.credit_limit);
          const ratio = limit > 0 ? Number(card.used_amount) / limit : 0;

          return (
            <ItemRow key={card.id} style={{ gridTemplateColumns: "1fr", gap: 8 }}>
              <span style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <ItemText>
                  <ItemTitle title={card.name}>{card.name}</ItemTitle>
                  <ItemMeta>Vence {dayjs(card.due_date).add(12, "hour").format("DD/MM")}</ItemMeta>
                </ItemText>
                <ItemAmount>{format_money(card.open_total)}</ItemAmount>
              </span>
              <MeterTrack role="meter" aria-label={`Limite usado do ${card.name}`} aria-valuenow={Math.round(ratio * 100)} aria-valuemin={0} aria-valuemax={100}>
                <MeterFill $share={ratio} $color={usage_color(ratio)} />
              </MeterTrack>
              <ItemMeta>
                {Math.round(ratio * 100)}% do limite de {format_money(limit)}
              </ItemMeta>
            </ItemRow>
          );
        })}
      </ItemList>
    )}
  </WidgetCard>
);
