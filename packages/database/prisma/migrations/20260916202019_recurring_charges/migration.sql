-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "installment_number" INTEGER,
ADD COLUMN     "recurring_charge_id" UUID;

-- CreateTable
CREATE TABLE "recurring_charges" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "category_id" UUID,
    "created_by_id" UUID,
    "description" TEXT NOT NULL,
    "installment_amount" DECIMAL(14,2) NOT NULL,
    "installment_count" INTEGER NOT NULL,
    "day_of_month" INTEGER NOT NULL,
    "starts_at_month" DATE NOT NULL,
    "last_generated_month" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recurring_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recurring_charges_workspace_id_idx" ON "recurring_charges"("workspace_id");

-- CreateIndex
CREATE INDEX "transactions_recurring_charge_id_idx" ON "transactions"("recurring_charge_id");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_recurring_charge_id_fkey" FOREIGN KEY ("recurring_charge_id") REFERENCES "recurring_charges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurring_charges" ADD CONSTRAINT "recurring_charges_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
