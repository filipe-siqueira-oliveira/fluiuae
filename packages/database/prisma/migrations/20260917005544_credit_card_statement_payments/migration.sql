-- CreateTable
CREATE TABLE "credit_card_statement_payments" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "credit_card_id" UUID NOT NULL,
    "transaction_id" UUID NOT NULL,
    "statement_month" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_card_statement_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credit_card_statement_payments_transaction_id_key" ON "credit_card_statement_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "credit_card_statement_payments_workspace_id_idx" ON "credit_card_statement_payments"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_card_statement_payments_credit_card_id_statement_mon_key" ON "credit_card_statement_payments"("credit_card_id", "statement_month");

-- AddForeignKey
ALTER TABLE "credit_card_statement_payments" ADD CONSTRAINT "credit_card_statement_payments_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_statement_payments" ADD CONSTRAINT "credit_card_statement_payments_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_card_statement_payments" ADD CONSTRAINT "credit_card_statement_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
