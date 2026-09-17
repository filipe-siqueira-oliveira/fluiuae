ALTER TABLE "categories" ADD COLUMN "is_system" BOOLEAN NOT NULL DEFAULT false;

UPDATE "categories" SET "is_system" = true WHERE "kind" = 'SYSTEM';

INSERT INTO "categories" ("id", "workspace_id", "name", "kind", "color", "is_system", "is_archived", "created_at", "updated_at")
SELECT gen_random_uuid(), "workspace_id", "name", 'INCOME'::"CategoryKind", "color", true, "is_archived", now(), now()
FROM "categories"
WHERE "kind" = 'SYSTEM' AND "name" IN ('Outros', 'Transferência mesmo titular');

UPDATE "transactions" AS "movement"
SET "category_id" = "income_copy"."id"
FROM "categories" AS "system_category", "categories" AS "income_copy"
WHERE "movement"."category_id" = "system_category"."id"
  AND "movement"."type" = 'INCOME'
  AND "system_category"."kind" = 'SYSTEM'
  AND "income_copy"."workspace_id" = "system_category"."workspace_id"
  AND "income_copy"."name" = "system_category"."name"
  AND "income_copy"."kind" = 'INCOME'
  AND "income_copy"."is_system" = true;

UPDATE "fixed_transactions" AS "movement"
SET "category_id" = "income_copy"."id"
FROM "categories" AS "system_category", "categories" AS "income_copy"
WHERE "movement"."category_id" = "system_category"."id"
  AND "movement"."type" = 'INCOME'
  AND "system_category"."kind" = 'SYSTEM'
  AND "income_copy"."workspace_id" = "system_category"."workspace_id"
  AND "income_copy"."name" = "system_category"."name"
  AND "income_copy"."kind" = 'INCOME'
  AND "income_copy"."is_system" = true;

UPDATE "categories"
SET "kind" = CASE WHEN "name" IN ('Recebimentos', 'Resgate aplicação') THEN 'INCOME'::"CategoryKind" ELSE 'EXPENSE'::"CategoryKind" END
WHERE "kind" = 'SYSTEM';

CREATE TYPE "CategoryKind_new" AS ENUM ('INCOME', 'EXPENSE');
ALTER TABLE "categories" ALTER COLUMN "kind" TYPE "CategoryKind_new" USING ("kind"::text::"CategoryKind_new");
ALTER TYPE "CategoryKind" RENAME TO "CategoryKind_old";
ALTER TYPE "CategoryKind_new" RENAME TO "CategoryKind";
DROP TYPE "CategoryKind_old";
