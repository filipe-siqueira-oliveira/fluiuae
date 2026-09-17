import {
  build_institution_form_fields,
  to_institution_payload_fields,
  type InstitutionFormFields,
} from "@/features/institutions/helpers/institution_form_fields";
import type { CreditCardPayload } from "../api/credit_cards_api";
import type { CreditCardDto } from "@/types/api";

export type CreditCardFormValues = InstitutionFormFields & {
  name: string;
  credit_limit: number | null;
  statement_closing_day: number | null;
  payment_due_day: number | null;
  is_default: boolean;
};

export const build_credit_card_form_values = (
  credit_card: CreditCardDto | null
): CreditCardFormValues => ({
  ...build_institution_form_fields(credit_card),
  name: credit_card?.name ?? "",
  credit_limit: credit_card ? Number(credit_card.credit_limit) : null,
  statement_closing_day: credit_card?.statement_closing_day ?? null,
  payment_due_day: credit_card?.payment_due_day ?? null,
  is_default: credit_card?.is_default ?? false,
});

export const to_credit_card_payload = (values: CreditCardFormValues): CreditCardPayload => ({
  ...to_institution_payload_fields(values),
  name: values.name,
  credit_limit: Number(values.credit_limit),
  statement_closing_day: Number(values.statement_closing_day),
  payment_due_day: Number(values.payment_due_day),
  is_default: Boolean(values.is_default),
});
