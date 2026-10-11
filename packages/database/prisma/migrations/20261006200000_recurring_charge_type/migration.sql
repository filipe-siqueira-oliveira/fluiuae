ALTER TABLE "recurring_charges" ADD COLUMN "type" "TransactionType" NOT NULL DEFAULT 'EXPENSE';

ALTER TABLE "recurring_charges"
  ADD CONSTRAINT "recurring_charges_type_check"
  CHECK ("type" IN ('INCOME', 'EXPENSE'));

ALTER TABLE "recurring_charges"
  ADD CONSTRAINT "recurring_charges_income_without_card_check"
  CHECK ("type" = 'EXPENSE' OR "credit_card_id" IS NULL);
