import {
  getDefaultDocumentContent,
  mergeDocumentContent,
  parseDocumentContent,
  resolveDocumentContent,
  type DocumentContent,
} from "./documentContent";
import { getDefaultValues, getEmptyValues } from "./defaultValues";
import { getBuiltInTemplate, getTemplateDefaults } from "./templates";
import { SIJABLOON_1_SLUG } from "./templateConstants";
import type { ContractFormData } from "./types";

export interface TemplateRecordPayload {
  slug: string;
  defaultFormData?: unknown;
  documentContent?: unknown;
  baseTemplateSlug?: string | null;
}

export function resolveBaseTemplateSlug(
  slug: string,
  baseTemplateSlug?: string | null
): string {
  if (baseTemplateSlug) return baseTemplateSlug;
  const builtIn = getBuiltInTemplate(slug);
  if (builtIn) return builtIn.slug;
  return SIJABLOON_1_SLUG;
}

export function applyTemplateRecord(
  template: TemplateRecordPayload,
  currentData?: ContractFormData
): ContractFormData {
  const baseSlug = resolveBaseTemplateSlug(
    template.slug,
    template.baseTemplateSlug
  );
  const builtInDefaults = getTemplateDefaults(baseSlug);
  const storedDefaults =
    template.defaultFormData && typeof template.defaultFormData === "object"
      ? (template.defaultFormData as Partial<ContractFormData>)
      : {};

  const merged: ContractFormData = {
    ...builtInDefaults,
    ...storedDefaults,
    templateSlug: template.slug,
    baseTemplateSlug: baseSlug,
    documentContent: resolveDocumentContent(
      mergeDocumentContent(
        getDefaultDocumentContent(baseSlug),
        parseDocumentContent(template.documentContent) ??
          storedDefaults.documentContent
      )
    ),
  };

  if (currentData?.documentContent && template.slug === currentData.templateSlug) {
    merged.documentContent = currentData.documentContent;
  }

  return merged;
}

export function stripClientFieldsForTemplate(
  data: ContractFormData
): ContractFormData {
  const empty = getEmptyValues(data.templateSlug);
  return {
    ...data,
    bedrijfsnaam: empty.bedrijfsnaam,
    aanhef: empty.aanhef,
    contactpersoon: empty.contactpersoon,
    adres: empty.adres,
    postcode: empty.postcode,
    plaats: empty.plaats,
    verantwoordelijkeLogoNaam: empty.verantwoordelijkeLogoNaam,
    verantwoordelijkeLogoTelefoon: empty.verantwoordelijkeLogoTelefoon,
    verantwoordelijkeLogoEmail: empty.verantwoordelijkeLogoEmail,
    verantwoordelijkeAdressenNaam: empty.verantwoordelijkeAdressenNaam,
    verantwoordelijkeAdressenTelefoon: empty.verantwoordelijkeAdressenTelefoon,
    verantwoordelijkeAdressenEmail: empty.verantwoordelijkeAdressenEmail,
  };
}

export function buildTemplateSavePayload(
  data: ContractFormData,
  options: { clearClientFields: boolean }
): {
  defaultFormData: ContractFormData;
  documentContent?: DocumentContent;
  baseTemplateSlug: string;
} {
  const formData = options.clearClientFields
    ? stripClientFieldsForTemplate(data)
    : structuredClone(data);

  return {
    defaultFormData: formData,
    documentContent: data.documentContent,
    baseTemplateSlug: resolveBaseTemplateSlug(
      data.templateSlug,
      data.baseTemplateSlug
    ),
  };
}

export function ensureDocumentContent(
  data: ContractFormData
): ContractFormData {
  const baseSlug = resolveBaseTemplateSlug(data.templateSlug, data.baseTemplateSlug);
  const defaults = getDefaultDocumentContent(baseSlug);
  if (!defaults) return data;

  if (!data.documentContent) {
    return {
      ...data,
      baseTemplateSlug: baseSlug,
      documentContent: structuredClone(defaults),
    };
  }

  const { fullText: _ignored, ...stored } = data.documentContent;

  return {
    ...data,
    baseTemplateSlug: baseSlug,
    documentContent: resolveDocumentContent({
      ...defaults,
      ...stored,
      articles: { ...defaults.articles, ...stored.articles },
    }),
  };
}

export function getInitialFormData(initialData?: ContractFormData): ContractFormData {
  if (initialData) return ensureDocumentContent(initialData);
  return ensureDocumentContent(getDefaultValues());
}
