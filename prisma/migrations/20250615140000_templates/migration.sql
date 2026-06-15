-- CreateTable
CREATE TABLE "ContractTemplate" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContractTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContractTemplate_slug_key" ON "ContractTemplate"("slug");

-- AlterTable
ALTER TABLE "Contract" ADD COLUMN "templateId" TEXT;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ContractTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed built-in sjabloon 1
INSERT INTO "ContractTemplate" ("id", "slug", "name", "description", "isBuiltIn", "sortOrder", "createdAt", "updatedAt")
VALUES (
  '00000000-0000-4000-8000-000000000001',
  'sjabloon-1',
  'Sjabloon 1 — Budget decoratie (met proeftijd)',
  'Standaard KWC-overeenkomst met 15 artikelen, AVG, klachtenprotocol en adresaanlevering.',
  true,
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
