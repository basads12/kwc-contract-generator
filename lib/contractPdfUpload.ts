import type { Prisma } from "@prisma/client";
import { buildContractPdfBlobPath } from "@/lib/contractPdfFilename";
import { parseFormDataWithDocument } from "@/lib/validation";

export function getContractPdfBlobPath(
  contractNumber: string,
  formData: Prisma.JsonValue
): string {
  const parsed = parseFormDataWithDocument(formData);
  return buildContractPdfBlobPath(
    contractNumber,
    parsed.bedrijfsnaam,
    parsed.datumOvereenkomst
  );
}
