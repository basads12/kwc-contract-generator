import type { ContractFormData } from "./types";
import { deriveContractDates, deriveIngangsdatum } from "./deriveDates";
import { SIJABLOON_1_SLUG } from "./templateConstants";

const datumOvereenkomst = "2026-06-08";
const derived = deriveContractDates(
  datumOvereenkomst,
  deriveIngangsdatum(datumOvereenkomst)
);

const baseDefaults: ContractFormData = {
  bedrijfsnaam: "Budget decoratie",
  aanhef: "dhr.",
  contactpersoon: "Kaan Kirtil",
  adres: "Frederik van Eedenstraat 56",
  postcode: "7606 BJ",
  plaats: "Almelo",
  plaatsOndertekening: "Hengelo",
  datumOvereenkomst,
  ingangsdatum: derived.ingangsdatum,
  looptijdJaren: 3,
  bestedingsgrens: 750,
  waardeKwc: 500,
  geldigheidsduurKwcMaanden: 3,
  aantalBestaandeKlanten: 0,
  portokosten: "",
  aantalAdressenPerJaar: 300,
  tariefPerAdres: 12,
  jaarbedrag: 3600,
  maandbedrag: 300,
  ondergrens: 210,
  bovengrens: 390,
  kunstbudget: 3600,
  betaaltermijnDagen: 8,
  proefperiodeActief: false,
  proefperiodeStartdatum: derived.ingangsdatum,
  proefperiodeMaanden: 6,
  naamVertegenwoordigerGalerie: "Alex Vos",
  naamTweedeVertegenwoordigerGalerie: "Robert Staal",
  datumLogoAanlevering: derived.datumLogoAanlevering,
  datumAkkoordProefdruk: derived.datumAkkoordProefdruk,
  datumAdresgegevens: derived.datumAdresgegevens,
  verantwoordelijkeLogoNaam: "",
  verantwoordelijkeLogoTelefoon: "",
  verantwoordelijkeLogoEmail: "",
  verantwoordelijkeAdressenNaam: "",
  verantwoordelijkeAdressenTelefoon: "",
  verantwoordelijkeAdressenEmail: "",
  deadlineNawLevering: derived.deadlineNawLevering,
  templateSlug: SIJABLOON_1_SLUG,
};

export function getDefaultValues(): ContractFormData {
  return structuredClone(baseDefaults);
}

export function getEmptyValues(templateSlug = SIJABLOON_1_SLUG): ContractFormData {
  return {
    bedrijfsnaam: "",
    aanhef: "",
    contactpersoon: "",
    adres: "",
    postcode: "",
    plaats: "",
    plaatsOndertekening: "",
    datumOvereenkomst: "",
    ingangsdatum: "",
    looptijdJaren: 0,
    bestedingsgrens: 0,
    waardeKwc: 0,
    geldigheidsduurKwcMaanden: 0,
    aantalBestaandeKlanten: 0,
    portokosten: "",
    aantalAdressenPerJaar: 0,
    tariefPerAdres: 0,
    jaarbedrag: 0,
    maandbedrag: 0,
    ondergrens: 0,
    bovengrens: 0,
    kunstbudget: 0,
    betaaltermijnDagen: 0,
    proefperiodeActief: false,
    proefperiodeStartdatum: "",
    proefperiodeMaanden: 6,
    naamVertegenwoordigerGalerie: "",
    naamTweedeVertegenwoordigerGalerie: "",
    datumLogoAanlevering: "",
    datumAkkoordProefdruk: "",
    datumAdresgegevens: "",
    verantwoordelijkeLogoNaam: "",
    verantwoordelijkeLogoTelefoon: "",
    verantwoordelijkeLogoEmail: "",
    verantwoordelijkeAdressenNaam: "",
    verantwoordelijkeAdressenTelefoon: "",
    verantwoordelijkeAdressenEmail: "",
    deadlineNawLevering: "",
    templateSlug,
  };
}

/** @deprecated Use getDefaultValues() for a fresh copy */
export const defaultValues = baseDefaults;
