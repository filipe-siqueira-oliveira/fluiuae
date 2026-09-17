-- CreateTable
CREATE TABLE "credit_cards" (
    "id" UUID NOT NULL,
    "workspace_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "institution" TEXT,
    "institution_ispb" TEXT,
    "credit_limit" DECIMAL(14,2) NOT NULL,
    "statement_closing_day" INTEGER NOT NULL,
    "payment_due_day" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "credit_cards_workspace_id_idx" ON "credit_cards"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_cards_workspace_id_name_key" ON "credit_cards"("workspace_id", "name");

-- AddForeignKey
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;
