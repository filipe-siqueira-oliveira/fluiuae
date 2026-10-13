-- DropIndex
DROP INDEX "credit_card_statement_payments_credit_card_id_statement_mon_key";

-- CreateIndex
CREATE INDEX "credit_card_statement_payments_credit_card_id_statement_mon_idx" ON "credit_card_statement_payments"("credit_card_id", "statement_month");
