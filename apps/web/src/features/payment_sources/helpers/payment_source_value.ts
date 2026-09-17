export type PaymentSourceKind = "account" | "credit_card";

export type SelectablePaymentSource = {
  id: string;
  name: string;
  is_default: boolean;
};

export type PaymentSourceReference = {
  account: { id: string; name: string } | null;
  credit_card: { id: string; name: string } | null;
};

export type PaymentSourceIds = {
  account_id: string | null;
  credit_card_id: string | null;
};

const separator = ":";

export const encode_payment_source = (kind: PaymentSourceKind, id: string): string =>
  `${kind}${separator}${id}`;

export const decode_payment_source = (value: string | null | undefined): PaymentSourceIds => {
  const [kind, id] = (value ?? "").split(separator);

  return {
    account_id: kind === "account" && id ? id : null,
    credit_card_id: kind === "credit_card" && id ? id : null,
  };
};

export const is_credit_card_source = (value: string | null | undefined): boolean =>
  Boolean(decode_payment_source(value).credit_card_id);

export const payment_source_from_reference = (
  reference: PaymentSourceReference | null | undefined
): string | undefined => {
  if (reference?.account) {
    return encode_payment_source("account", reference.account.id);
  }

  if (reference?.credit_card) {
    return encode_payment_source("credit_card", reference.credit_card.id);
  }

  return undefined;
};

export const resolve_default_payment_source = (input: {
  accounts: SelectablePaymentSource[];
  credit_cards: SelectablePaymentSource[];
  allows_credit_card: boolean;
  falls_back_to_first_account: boolean;
}): string | undefined => {
  const default_account = input.accounts.find((account) => account.is_default);

  if (default_account) {
    return encode_payment_source("account", default_account.id);
  }

  const default_credit_card = input.credit_cards.find((credit_card) => credit_card.is_default);

  if (input.allows_credit_card && default_credit_card) {
    return encode_payment_source("credit_card", default_credit_card.id);
  }

  const first_account = input.accounts[0];

  return input.falls_back_to_first_account && first_account
    ? encode_payment_source("account", first_account.id)
    : undefined;
};
