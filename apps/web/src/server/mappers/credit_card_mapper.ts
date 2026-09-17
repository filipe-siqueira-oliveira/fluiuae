import type { CreditCard } from "@fluiuae/database";
import {
  resolve_open_statement_month,
  resolve_statement_due_date,
} from "@/lib/credit_card_statement";
import { next_occurrence_of_day } from "@/lib/month_calendar";
import { find_institution } from "@/server/institutions/institution_catalog";
import type { CreditCardDto } from "@/types/api";
import { serialize_decimal } from "./decimal_serializer";

export const to_credit_card_dto = (credit_card: CreditCard, used_amount = 0): CreditCardDto => ({
  id: credit_card.id,
  name: credit_card.name,
  institution: credit_card.institution,
  institution_ispb: credit_card.institution_ispb,
  institution_has_logo: find_institution(credit_card.institution_ispb)?.has_logo ?? false,
  credit_limit: serialize_decimal(credit_card.credit_limit),
  statement_closing_day: credit_card.statement_closing_day,
  payment_due_day: credit_card.payment_due_day,
  is_default: credit_card.is_default,
  next_closing_date: next_occurrence_of_day(credit_card.statement_closing_day).toISOString(),
  next_due_date: next_occurrence_of_day(credit_card.payment_due_day).toISOString(),
  open_statement_due_date: resolve_statement_due_date(
    resolve_open_statement_month(credit_card.statement_closing_day),
    credit_card.statement_closing_day,
    credit_card.payment_due_day
  ).toISOString(),
  used_amount: used_amount.toFixed(2),
});
