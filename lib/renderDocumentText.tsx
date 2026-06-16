import type { ReactNode } from "react";
import type { ContractCalculations, ContractFormData } from "@/lib/types";
import {
  formatAantalBestaandeKlanten,
  formatBetaaltermijn,
  formatCurrency,
  formatCurrencyArt7Monthly,
  formatCurrencyDecimal,
  formatDateDayMonth,
  formatDateShort,
  formatGeldigheidsduur,
  formatLooptijd,
  formatPortokosten,
} from "@/lib/formatters";

export interface DocumentRenderContext {
  data: ContractFormData;
  calculations: ContractCalculations;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildDocumentPlaceholderMap(
  context: DocumentRenderContext
): Record<string, string> {
  const { data, calculations } = context;
  const ingangsdatum = formatDateShort(data.ingangsdatum);
  const portokostenTekst = formatPortokosten(data.portokosten);
  const aantalKlanten = formatAantalBestaandeKlanten(data.aantalBestaandeKlanten);

  return {
    bestedingsgrens: formatCurrency(data.bestedingsgrens),
    waardeKwc: formatCurrency(data.waardeKwc),
    ingangsdatum,
    looptijdJaren: formatLooptijd(data.looptijdJaren),
    aantalBestaandeKlanten: aantalKlanten,
    portokostenTekst,
    deadlineNawLevering: formatDateDayMonth(data.deadlineNawLevering),
    aantalAdressenPerJaar: String(data.aantalAdressenPerJaar),
    tariefPerAdres: formatCurrencyDecimal(data.tariefPerAdres),
    jaarbedrag: formatCurrency(calculations.jaarbedrag),
    maandbedrag: formatCurrencyArt7Monthly(calculations.maandbedrag),
    ondergrens: String(calculations.ondergrens),
    bovengrens: String(calculations.bovengrens),
    kunstbudget: formatCurrency(calculations.kunstbudget),
    betaaltermijnDagen: formatBetaaltermijn(data.betaaltermijnDagen),
    geldigheidsduurKwcMaanden: formatGeldigheidsduur(
      data.geldigheidsduurKwcMaanden
    ),
    proefperiodeMaanden: formatGeldigheidsduur(data.proefperiodeMaanden),
    proefperiodeStartdatum: formatDateShort(
      data.proefperiodeStartdatum || data.ingangsdatum
    ),
    proefperiodeIntroZin: data.proefperiodeActief
      ? ", en gedurende de proefperiode kunt u eenvoudig en zonder kosten terug"
      : "",
    boete1000: formatCurrency(1000),
    bpMinimum: formatCurrency(25),
  };
}

export function normalizeIntroProefperiodeTemplate(intro: string): string {
  if (intro.includes("{{proefperiodeIntroZin}}")) return intro;
  return intro.replace(
    /, en gedurende de proefperiode kunt u eenvoudig en zonder kosten terug\./,
    "{{proefperiodeIntroZin}}."
  );
}

export function applyDocumentPlaceholders(
  text: string,
  context: DocumentRenderContext
): string {
  const map = buildDocumentPlaceholderMap(context);
  let result = text;
  for (const [key, value] of Object.entries(map)) {
    result = result.replace(new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, "g"), value);
  }
  return result;
}

export function renderDocumentText(
  text: string,
  context: DocumentRenderContext
): ReactNode {
  return applyDocumentPlaceholders(text, context);
}
