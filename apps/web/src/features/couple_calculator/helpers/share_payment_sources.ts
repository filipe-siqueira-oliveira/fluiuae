import {
  decode_payment_source,
  resolve_default_payment_source,
} from "@/features/payment_sources/helpers/payment_source_value";
import type { WorkspacePaymentSourcesDto } from "@/types/api";

export const pick_default_source = (sources: WorkspacePaymentSourcesDto): string | undefined =>
  resolve_default_payment_source({
    accounts: sources.accounts,
    credit_cards: sources.credit_cards,
    allows_credit_card: true,
    falls_back_to_first_account: true,
  });

export const contains_source = (sources: WorkspacePaymentSourcesDto, encoded_source: string | undefined): boolean => {
  const { account_id, credit_card_id } = decode_payment_source(encoded_source);

  return (
    sources.accounts.some((account) => account.id === account_id) ||
    sources.credit_cards.some((credit_card) => credit_card.id === credit_card_id)
  );
};

export const find_source_name = (
  sources: WorkspacePaymentSourcesDto | undefined,
  encoded_source: string | undefined
): string | null => {
  const { account_id, credit_card_id } = decode_payment_source(encoded_source);
  const match =
    sources?.accounts.find((account) => account.id === account_id) ??
    sources?.credit_cards.find((credit_card) => credit_card.id === credit_card_id);

  return match?.name ?? null;
};

export const find_receiving_account_name = (
  sources: WorkspacePaymentSourcesDto | undefined,
  encoded_source: string | undefined
): string | null => {
  const { account_id } = decode_payment_source(encoded_source);
  const chosen_account = sources?.accounts.find((account) => account.id === account_id);

  return chosen_account?.name ?? sources?.accounts[0]?.name ?? null;
};
