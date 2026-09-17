-- AlterTable
ALTER TABLE "fixed_transactions" ADD COLUMN     "is_automatic_debit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "recurring_charges" ADD COLUMN     "is_automatic_debit" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "is_automatic_debit" BOOLEAN NOT NULL DEFAULT false;
