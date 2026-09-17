"use client";

import Link from "next/link";
import { BankLogo } from "@/components/data/bank_logo";
import { format_money } from "@/lib/money_formatter";
import { WidgetCard } from "../components/widget_card";
import {
  BigFigure,
  ItemAmount,
  ItemIdentity,
  ItemList,
  ItemRow,
  ItemTitle,
  WidgetEmpty,
} from "../components/widget_styles";
import type { DashboardDto } from "@/types/api";

export const BalanceWidget = ({ dashboard }: { dashboard: DashboardDto }) => {
  const total = Number(dashboard.balance.total);

  return (
    <WidgetCard title="Saldo das contas" subtitle="Somando todas as contas">
      <BigFigure $tone={total < 0 ? "negative" : "neutral"}>{format_money(total)}</BigFigure>
      {dashboard.balance.accounts.length === 0 ? (
        <WidgetEmpty>
          Nenhuma conta ainda. <Link href="/accounts">Cadastre uma conta</Link>.
        </WidgetEmpty>
      ) : (
        <ItemList style={{ marginTop: 12 }}>
          {dashboard.balance.accounts.map((account) => (
            <ItemRow key={account.id}>
              <ItemIdentity>
                <BankLogo
                  ispb={account.institution_ispb}
                  name={account.institution ?? account.name}
                  has_logo={account.institution_has_logo}
                  size={28}
                  is_circle
                />
                <ItemTitle title={account.name}>{account.name}</ItemTitle>
              </ItemIdentity>
              <ItemAmount $tone={Number(account.balance) < 0 ? "danger" : "neutral"}>
                {format_money(account.balance)}
              </ItemAmount>
            </ItemRow>
          ))}
        </ItemList>
      )}
    </WidgetCard>
  );
};
