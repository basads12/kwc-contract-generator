import { z } from "zod";
import type { Prisma } from "@prisma/client";
import type { ContractFormData } from "./types";
import { getDefaultValues } from "./defaultValues";
import { parseDocumentContent } from "./documentContent";
import { isValidContractStatus } from "./contract-status";
import type { ContractStatus } from "@prisma/client";

export const contractFormSchema = z.object({
  bedrijfsnaam: z.string().min(1),
  aanhef: z.string().default("dhr."),
  contactpersoon: z.string().min(1),
  adres: z.string().min(1),
  postcode: z.string().min(1),
  plaats: z.string().min(1),
  plaatsOndertekening: z.string().default("Hengelo"),
  datumOvereenkomst: z.string().min(1),
  ingangsdatum: z.string().min(1),
  looptijdJaren: z.coerce.number(),
  bestedingsgrens: z.coerce.number(),
  waardeKwc: z.coerce.number(),
  geldigheidsduurKwcMaanden: z.coerce.number(),
  aantalBestaandeKlanten: z.coerce.number(),
  portokosten: z.string(),
  aantalAdressenPerJaar: z.coerce.number(),
  tariefPerAdres: z.coerce.number(),
  jaarbedrag: z.coerce.number(),
  maandbedrag: z.coerce.number(),
  ondergrens: z.coerce.number(),
  bovengrens: z.coerce.number(),
  kunstbudget: z.coerce.number(),
  betaaltermijnDagen: z.coerce.number(),
  proefperiodeActief: z.boolean().default(false),
  proefperiodeStartdatum: z.string().default(""),
  proefperiodeMaanden: z.coerce.number().default(6),
  naamVertegenwoordigerGalerie: z.string().min(1),
  naamTweedeVertegenwoordigerGalerie: z.string().default("Robert Staal"),
  datumLogoAanlevering: z.string().min(1),
  datumAkkoordProefdruk: z.string().min(1),
  datumAdresgegevens: z.string().min(1),
  verantwoordelijkeLogoNaam: z.string(),
  verantwoordelijkeLogoTelefoon: z.string(),
  verantwoordelijkeLogoEmail: z.string(),
  verantwoordelijkeAdressenNaam: z.string(),
  verantwoordelijkeAdressenTelefoon: z.string(),
  verantwoordelijkeAdressenEmail: z.string(),
  deadlineNawLevering: z.string().min(1),
  templateSlug: z.string().min(1),
  baseTemplateSlug: z.string().optional(),
});

export function parseFormData(data: unknown): ContractFormData {
  const defaults = getDefaultValues();
  const merged =
    typeof data === "object" && data !== null
      ? { ...defaults, ...data }
      : defaults;
  return contractFormSchema.parse(merged);
}

export function parseFormDataWithDocument(data: unknown): ContractFormData {
  const parsed = parseFormData(data);
  if (
    typeof data === "object" &&
    data !== null &&
    "documentContent" in data
  ) {
    parsed.documentContent = parseDocumentContent(
      (data as { documentContent?: unknown }).documentContent
    );
  }
  return parsed;
}

export function parseContractStatus(value: unknown): ContractStatus {
  if (typeof value !== "string" || !isValidContractStatus(value)) {
    throw new Error("Ongeldige contractstatus");
  }
  return value;
}

export function toPrismaJson(data: ContractFormData): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

export function toPrismaJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
