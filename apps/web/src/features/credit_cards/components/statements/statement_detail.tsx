"use client";

import { useState } from "react";
import { Input } from "antd";
import { Search } from "lucide-react";
import { format_money } from "@/lib/money_formatter";
import { filter_statement_purchases, group_purchases_by_day } from "../../helpers/statement_purchase_groups";
import { StatementPurchaseRow } from "./statement_purchase_row";
import {
  PurchaseDayGroup,
  PurchaseDayHeader,
  PurchaseDayLabel,
  PurchaseList,
  StatementDetailColumn,
  StatementMessage,
  StatementPurchasesScroller,
} from "./statements_modal_styles";
import type { CreditCardStatementDetailDto } from "@/types/api";

type StatementDetailProps = {
  statement: CreditCardStatementDetailDto;
};

export const StatementDetail = ({ statement }: StatementDetailProps) => {
  const [query, set_query] = useState("");
  const day_groups = group_purchases_by_day(filter_statement_purchases(statement.purchases, query));

  const render_purchases = () => {
    if (statement.purchases.length === 0) {
      return <StatementMessage>Nenhuma compra nesta fatura.</StatementMessage>;
    }

    if (day_groups.length === 0) {
      return <StatementMessage>Nenhuma compra encontrada para “{query}”.</StatementMessage>;
    }

    return day_groups.map((group) => (
      <PurchaseDayGroup key={group.day_key} aria-labelledby={`purchase_day_${group.day_key}`}>
        <PurchaseDayHeader>
          <PurchaseDayLabel id={`purchase_day_${group.day_key}`}>{group.day_label}</PurchaseDayLabel>
          <span>{format_money(-group.total)}</span>
        </PurchaseDayHeader>
        <PurchaseList>
          {group.purchases.map((purchase) => (
            <StatementPurchaseRow key={purchase.id} purchase={purchase} />
          ))}
        </PurchaseList>
      </PurchaseDayGroup>
    ));
  };

  return (
    <StatementDetailColumn aria-label="Compras da fatura">
      <Input
        size="large"
        allowClear
        value={query}
        onChange={(event) => set_query(event.target.value)}
        prefix={<Search size={16} />}
        placeholder="Buscar na fatura..."
        aria-label="Buscar na fatura"
      />
      <StatementPurchasesScroller>{render_purchases()}</StatementPurchasesScroller>
    </StatementDetailColumn>
  );
};
