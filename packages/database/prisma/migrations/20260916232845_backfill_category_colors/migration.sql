UPDATE "categories" SET "color" = "system_colors"."color"
FROM (
  VALUES
    ('Cartão de crédito', '#0090FF'),
    ('Depósito aplicação', '#2F6B4F'),
    ('Outros', '#101828'),
    ('Recebimentos', '#30A46C'),
    ('Resgate aplicação', '#2F6B4F'),
    ('Tarifas bancárias', '#E5484D'),
    ('Transferência mesmo titular', '#FFB224'),
    ('Transferência para terceiros', '#F76B15')
) AS "system_colors" ("name", "color")
WHERE "categories"."kind" = 'SYSTEM' AND "categories"."name" = "system_colors"."name";

WITH "palette" AS (
  SELECT ARRAY['#E5484D', '#F76B15', '#FFB224', '#30A46C', '#12A594', '#05A2C2', '#0090FF', '#3E63DD', '#8E4EC6', '#D6409F'] AS "colors"
),
"ranked_categories" AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "workspace_id" ORDER BY "kind", "name") AS "position"
  FROM "categories"
  WHERE "kind" <> 'SYSTEM'
)
UPDATE "categories" SET "color" = "palette"."colors"[(("ranked_categories"."position" - 1) % 10) + 1]
FROM "ranked_categories", "palette"
WHERE "categories"."id" = "ranked_categories"."id";
