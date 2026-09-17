-- AlterEnum
BEGIN;
CREATE TYPE "AccountType_new" AS ENUM ('CHECKING', 'SAVINGS', 'SALARY');
ALTER TABLE "public"."accounts" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "accounts" ALTER COLUMN "type" TYPE "AccountType_new" USING ("type"::text::"AccountType_new");
ALTER TYPE "AccountType" RENAME TO "AccountType_old";
ALTER TYPE "AccountType_new" RENAME TO "AccountType";
DROP TYPE "public"."AccountType_old";
ALTER TABLE "accounts" ALTER COLUMN "type" SET DEFAULT 'CHECKING';
COMMIT;

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "credit_limit",
DROP COLUMN "payment_due_day",
DROP COLUMN "statement_closing_day";

