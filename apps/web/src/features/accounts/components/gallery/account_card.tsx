"use client";

import { BankLogo } from "@/components/data/bank_logo";
import { Sparkline } from "@/components/data/sparkline";
import { StatusPill } from "@/components/data/status_pill";
import { format_money } from "@/lib/money_formatter";
import { translate_account_type } from "../../helpers/account_labels";
import { AccountFlowBar } from "./account_flow_bar";
import {
  CardBalance,
  CardBalanceColumn,
  CardBalanceNote,
  CardBottom,
  CardFrame,
  CardIdentity,
  CardName,
  CardOrigin,
  CardTags,
  CardText,
  CardTop,
  LogoRing,
} from "./account_card_styles";
import type { AccountDto } from "@/types/api";

type AccountCardProps = {
  account: AccountDto;
};

export const AccountCard = ({ account }: AccountCardProps) => (
  <CardFrame $is_archived={account.is_archived}>
    <CardTop>
      <CardIdentity>
        <LogoRing>
          <BankLogo
            ispb={account.institution_ispb}
            name={account.institution ?? account.name}
            has_logo={account.institution_has_logo}
            size={48}
            is_circle
          />
        </LogoRing>
        <CardText>
          <CardName title={account.name}>{account.name}</CardName>
          <CardTags>
            {translate_account_type(account.type)}
            {account.is_default ? <StatusPill tone="income">Padrão</StatusPill> : null}
            {account.is_archived ? <StatusPill tone="neutral">Arquivada</StatusPill> : null}
          </CardTags>
          <CardOrigin>{account.institution ?? "Sem instituição"}</CardOrigin>
        </CardText>
      </CardIdentity>
      <CardBalanceColumn>
        <CardBalance $is_negative={Number(account.current_balance) < 0}>
          {format_money(account.current_balance)}
        </CardBalance>
        <Sparkline values={account.balance_trend} label={`Saldo de ${account.name} nos últimos 30 dias`} />
        <CardBalanceNote>Saldo inicial {format_money(account.initial_balance)}</CardBalanceNote>
      </CardBalanceColumn>
    </CardTop>
    <CardBottom>
      <AccountFlowBar month_income={account.month_income} month_expense={account.month_expense} />
    </CardBottom>
  </CardFrame>
);
