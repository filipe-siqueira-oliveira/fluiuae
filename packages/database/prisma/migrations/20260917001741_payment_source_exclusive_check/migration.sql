ALTER TABLE "transactions"
  ADD CONSTRAINT "transactions_single_payment_source_check"
  CHECK (("account_id" IS NOT NULL) <> ("credit_card_id" IS NOT NULL));

ALTER TABLE "fixed_transactions"
  ADD CONSTRAINT "fixed_transactions_single_payment_source_check"
  CHECK (("account_id" IS NOT NULL) <> ("credit_card_id" IS NOT NULL));

ALTER TABLE "recurring_charges"
  ADD CONSTRAINT "recurring_charges_single_payment_source_check"
  CHECK (("account_id" IS NOT NULL) <> ("credit_card_id" IS NOT NULL));
