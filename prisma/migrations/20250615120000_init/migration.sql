-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('CONCEPT', 'KLAAR_VOOR_ONDERTEKENING', 'GETEKEND', 'KLANTLINK_VERZONDEN', 'INCASSO_VOORBEREID', 'AFGEROND');

-- CreateTable
CREATE TABLE "Contract" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'CONCEPT',
    "formData" JSONB NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "customerToken" TEXT NOT NULL,
    "signatureUrl" TEXT,
    "signerName" TEXT,
    "signerEmail" TEXT,
    "signedAt" TIMESTAMP(3),
    "signerIp" TEXT,
    "signerUserAgent" TEXT,
    "pdfUrl" TEXT,
    "incassoAcknowledged" BOOLEAN NOT NULL DEFAULT false,
    "incassoPreparedAt" TIMESTAMP(3),
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractNumber_key" ON "Contract"("contractNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_customerToken_key" ON "Contract"("customerToken");
