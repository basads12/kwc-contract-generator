-- AlterTable
ALTER TABLE "ContractTemplate" ADD COLUMN "baseTemplateSlug" TEXT NOT NULL DEFAULT 'sjabloon-1';
ALTER TABLE "ContractTemplate" ADD COLUMN "defaultFormData" JSONB;
ALTER TABLE "ContractTemplate" ADD COLUMN "documentContent" JSONB;
