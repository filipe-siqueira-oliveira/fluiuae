/*
  Warnings:

  - You are about to drop the column `is_recurring` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `parent_transaction_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence_frequency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence_interval` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `recurrence_until` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_parent_transaction_id_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "is_recurring",
DROP COLUMN "parent_transaction_id",
DROP COLUMN "recurrence_frequency",
DROP COLUMN "recurrence_interval",
DROP COLUMN "recurrence_until",
ADD COLUMN     "fixed_transaction_id" UUID;

-- DropEnum
DROP TYPE "RecurrenceFrequency";

-- CreateTable
CREATE TABLE "fixed_transactions" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "category_id" UUID,
    "created_by_id" UUID,
    "type" "TransactionType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "day_of_month" INTEGER NOT NULL,
    "starts_at_month" DATE NOT NULL,
    "last_generated_month" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fixed_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fixed_transactions_workspace_id_type_idx" ON "fixed_transactions"("workspace_id", "type");

-- CreateIndex
CREATE INDEX "transactions_fixed_transaction_id_idx" ON "transactions"("fixed_transaction_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_fixed_transaction_id_fkey" FOREIGN KEY ("fixed_transaction_id") REFERENCES "fixed_transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_transactions" ADD CONSTRAINT "fixed_transactions_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_transactions" ADD CONSTRAINT "fixed_transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_transactions" ADD CONSTRAINT "fixed_transactions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fixed_transactions" ADD CONSTRAINT "fixed_transactions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
