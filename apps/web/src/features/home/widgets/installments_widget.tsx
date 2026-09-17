"use client";

import dayjs from "dayjs";
import Link from "next/link";
import { format_money } from "@/lib/money_formatter";
import { WidgetCard } from "../components/widget_card";
import { BigFigure, FigureCaption, StatGrid, WidgetEmpty } from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const InstallmentsWidget = ({ dashboard }: { dashboard: DashboardDto }) => (
  <WidgetCard title="Parcelas em andamento" subtitle="Compras parceladas e cobranças com fim">
    {dashboard.installments.active_count === 0 ? (
      <WidgetEmpty>
        Nenhuma parcela em andamento. <Link href="/transactions/recurring-charges">Ver recorrências</Link>.
      </WidgetEmpty>
    ) : (
      <>
        <BigFigure>{format_money(dashboard.installments.remaining_total)}</BigFigure>
        <FigureCaption>
          Ainda falta pagar em {dashboard.installments.active_count}{" "}
          {dashboard.installments.active_count === 1 ? "recorrência" : "recorrências"}
        </FigureCaption>
        <StatGrid>
          <div>
            <dt>Parcelas deste mês</dt>
            <dd>{format_money(dashboard.installments.month_total)}</dd>
          </div>
          <div>
            <dt>Termina primeiro</dt>
            <dd>
              {dashboard.installments.next_ending
                ? `${dashboard.installments.next_ending.description}, ${dayjs(dashboard.installments.next_ending.ends_at_month).add(12, "hour").format("MMM/YY")}`
                : "—"}
            </dd>
          </div>
        </StatGrid>
      </>
    )}
  </WidgetCard>
);
