"use client";

import { PaymentSourceLabel } from "./payment_source_label";
import type { PaymentSourceReference } from "../helpers/payment_source_value";

type PaymentSourceCellProps = {
  source: PaymentSourceReference;
};

export const PaymentSourceCell = ({ source }: PaymentSourceCellProps) => {
  if (source.credit_card) {
    return <PaymentSourceLabel kind="credit_card" name={source.credit_card.name} />;
  }

  if (source.account) {
    return <PaymentSourceLabel kind="account" name={source.account.name} />;
  }

  return <>—</>;
};
