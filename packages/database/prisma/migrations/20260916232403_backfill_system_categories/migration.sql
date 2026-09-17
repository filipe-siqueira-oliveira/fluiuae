INSERT INTO "categories" ("id", "workspace_id", "name", "kind", "is_archived", "created_at", "updated_at")
SELECT gen_random_uuid(), "workspaces"."id", "system_categories"."name", 'SYSTEM'::"CategoryKind", false, now(), now()
FROM "workspaces"
CROSS JOIN (
  VALUES
    ('Cartão de crédito'),
    ('Depósito aplicação'),
    ('Outros'),
    ('Recebimentos'),
    ('Resgate aplicação'),
    ('Tarifas bancárias'),
    ('Transferência mesmo titular'),
    ('Transferência para terceiros')
) AS "system_categories" ("name")
ON CONFLICT ("workspace_id", "name", "kind") DO NOTHING;
