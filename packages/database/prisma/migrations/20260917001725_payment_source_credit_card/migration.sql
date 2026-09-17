-- AlterTable
ALTER TABLE "fixed_transactions" ADD COLUMN     "credit_card_id" UUID,
ALTER COLUMN "account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "recurring_charges" ADD COLUMN     "credit_card_id" UUID,
ALTER COLUMN "account_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "credit_card_id" UUID,
ALTER COLUMN "account_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "transactions_credit_card_id_idx" ON "transactions"("credit_card_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_transactions" ADD CONSTRAINT "fixed_transactions_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_credit_card_id_fkey" FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
