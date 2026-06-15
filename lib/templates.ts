import { getDefaultValues } from "./defaultValues";
import { getDefaultDocumentContent } from "./documentContent";
import type { ContractFormData } from "./types";
import {
  SIJABLOON_1_ID,
  SIJABLOON_1_SLUG,
  SIJABLOON_2_ID,
  SIJABLOON_2_SLUG,
} from "./templateConstants";

export { SIJABLOON_1_ID, SIJABLOON_1_SLUG, SIJABLOON_2_ID, SIJABLOON_2_SLUG };

export interface BuiltInTemplate {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  getDefaults: () => ContractFormData;
}

export const BUILTIN_TEMPLATES: BuiltInTemplate[] = [
  {
    id: SIJABLOON_1_ID,
    slug: SIJABLOON_1_SLUG,
    name: "Sjabloon Overeenkomst Kunst-Waardecheques (KWC) - zakelijke klanten 15-6-2026",
    description:
      "Originele KWC-overeenkomst met 15 artikelen, AVG, klachtenprotocol en adresaanlevering.",
    sortOrder: 1,
    getDefaults: () => ({
      ...getDefaultValues(),
      templateSlug: SIJABLOON_1_SLUG,
      baseTemplateSlug: SIJABLOON_1_SLUG,
      documentContent: getDefaultDocumentContent(SIJABLOON_1_SLUG),
    }),
  },
  {
    id: SIJABLOON_2_ID,
    slug: SIJABLOON_2_SLUG,
    name: "Sjabloon 2 Nieuw Overeenkomst zakelijke klanten",
    description:
      "Nieuwe KWC-overeenkomst met 22 artikelen, uitgebreide AVG-verwerkersovereenkomst, klachtenprotocol en adresaanlevering.",
    sortOrder: 2,
    getDefaults: () => ({
      ...getDefaultValues(),
      templateSlug: SIJABLOON_2_SLUG,
      baseTemplateSlug: SIJABLOON_2_SLUG,
    }),
  },
];

export function getBuiltInTemplate(slug: string): BuiltInTemplate | undefined {
  return BUILTIN_TEMPLATES.find((template) => template.slug === slug);
}

export function getTemplateDefaults(slug: string): ContractFormData {
  const builtIn = getBuiltInTemplate(slug);
  if (builtIn) return builtIn.getDefaults();
  return {
    ...getDefaultValues(),
    templateSlug: slug,
    baseTemplateSlug: SIJABLOON_1_SLUG,
    documentContent: getDefaultDocumentContent(SIJABLOON_1_SLUG),
  };
}
