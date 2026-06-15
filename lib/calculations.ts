import type { ContractCalculations, ContractFormData } from "./types";

export const MIN_JAARBEDRAG_EX_BTW = 2400;

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function enforceMinimumJaarbedrag(jaarbedrag: number): number {
  const normalized = roundMoney(jaarbedrag);
  if (normalized === 0) return normalized;
  return Math.max(MIN_JAARBEDRAG_EX_BTW, normalized);
}

function syncTariefFromJaarAndAdressen(
  jaarbedrag: number,
  aantalAdressenPerJaar: number,
  tariefPerAdres: number
): number {
  if (aantalAdressenPerJaar > 0 && jaarbedrag > 0) {
    return roundMoney(jaarbedrag / aantalAdressenPerJaar);
  }
  return tariefPerAdres;
}

function syncFromJaarbedrag(jaarbedrag: number) {
  const normalized = enforceMinimumJaarbedrag(jaarbedrag);
  return {
    jaarbedrag: normalized,
    maandbedrag: syncMaandbedragFromJaar(normalized),
    kunstbudget: normalized,
  };
}

function deriveFromAdressenAndTarief(
  aantalAdressenPerJaar: number,
  tariefPerAdres: number
) {
  const product = roundMoney(aantalAdressenPerJaar * tariefPerAdres);
  let effectiveTarief = tariefPerAdres;
  let jaarbedrag = enforceMinimumJaarbedrag(product);

  if (
    product > 0 &&
    product < MIN_JAARBEDRAG_EX_BTW &&
    aantalAdressenPerJaar > 0
  ) {
    effectiveTarief = roundMoney(MIN_JAARBEDRAG_EX_BTW / aantalAdressenPerJaar);
    jaarbedrag = enforceMinimumJaarbedrag(
      roundMoney(aantalAdressenPerJaar * effectiveTarief)
    );
  }

  return {
    tariefPerAdres: effectiveTarief,
    ...syncBandbreedte(aantalAdressenPerJaar),
    ...syncFromJaarbedrag(jaarbedrag),
  };
}

function applyJaarbedragWithLinkage(
  data: ContractFormData,
  jaarbedrag: number
): ContractFormData {
  const financials = syncFromJaarbedrag(jaarbedrag);
  return {
    ...data,
    ...financials,
    tariefPerAdres: syncTariefFromJaarAndAdressen(
      financials.jaarbedrag,
      data.aantalAdressenPerJaar,
      data.tariefPerAdres
    ),
  };
}

export function parseMoneyInput(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? roundMoney(parsed) : 0;
}

export function syncMaandbedragFromJaar(jaarbedrag: number): number {
  return roundMoney(jaarbedrag / 12);
}

export function syncJaarbedragFromMaand(maandbedrag: number): number {
  return roundMoney(maandbedrag * 12);
}

export function syncBandbreedte(aantalAdressenPerJaar: number) {
  return {
    ondergrens: Math.round(aantalAdressenPerJaar * 0.7),
    bovengrens: Math.round(aantalAdressenPerJaar * 1.3),
  };
}

export function applyJaarbedragChange(
  data: ContractFormData,
  jaarbedrag: number
): ContractFormData {
  return applyJaarbedragWithLinkage(data, jaarbedrag);
}

export function applyMaandbedragChange(
  data: ContractFormData,
  maandbedrag: number
): ContractFormData {
  return applyJaarbedragWithLinkage(
    data,
    syncJaarbedragFromMaand(maandbedrag)
  );
}

export function applyKunstbudgetChange(
  data: ContractFormData,
  kunstbudget: number
): ContractFormData {
  return applyJaarbedragWithLinkage(data, kunstbudget);
}

export function suggestCalculations(
  aantalAdressenPerJaar: number,
  tariefPerAdres: number
): ContractCalculations {
  const derived = deriveFromAdressenAndTarief(
    aantalAdressenPerJaar,
    tariefPerAdres
  );

  return {
    jaarbedrag: derived.jaarbedrag,
    maandbedrag: derived.maandbedrag,
    ondergrens: derived.ondergrens,
    bovengrens: derived.bovengrens,
    kunstbudget: derived.kunstbudget,
  };
}

export function applyAdressenOrTariefChange(
  data: ContractFormData,
  key: "aantalAdressenPerJaar" | "tariefPerAdres",
  value: number
): ContractFormData {
  return applySuggestedCalculations({ ...data, [key]: value });
}

export function calculateContractValues(
  data: ContractFormData
): ContractCalculations {
  return {
    jaarbedrag: data.jaarbedrag,
    maandbedrag: data.maandbedrag,
    ondergrens: data.ondergrens,
    bovengrens: data.bovengrens,
    kunstbudget: data.kunstbudget,
  };
}

export function applySuggestedCalculations(
  data: ContractFormData
): ContractFormData {
  return {
    ...data,
    ...deriveFromAdressenAndTarief(
      data.aantalAdressenPerJaar,
      data.tariefPerAdres
    ),
  };
}
