import type { DocumentContent } from "./documentContent";

export interface ContractFormData {
  bedrijfsnaam: string;
  aanhef: string;
  contactpersoon: string;
  adres: string;
  postcode: string;
  plaats: string;
  plaatsOndertekening: string;
  datumOvereenkomst: string;
  ingangsdatum: string;
  looptijdJaren: number;
  bestedingsgrens: number;
  waardeKwc: number;
  geldigheidsduurKwcMaanden: number;
  aantalBestaandeKlanten: number;
  portokosten: string;
  aantalAdressenPerJaar: number;
  tariefPerAdres: number;
  jaarbedrag: number;
  maandbedrag: number;
  ondergrens: number;
  bovengrens: number;
  kunstbudget: number;
  betaaltermijnDagen: number;
  proefperiodeMaanden: number;
  naamVertegenwoordigerGalerie: string;
  naamTweedeVertegenwoordigerGalerie: string;
  datumLogoAanlevering: string;
  datumAkkoordProefdruk: string;
  datumAdresgegevens: string;
  verantwoordelijkeLogoNaam: string;
  verantwoordelijkeLogoTelefoon: string;
  verantwoordelijkeLogoEmail: string;
  verantwoordelijkeAdressenNaam: string;
  verantwoordelijkeAdressenTelefoon: string;
  verantwoordelijkeAdressenEmail: string;
  deadlineNawLevering: string;
  templateSlug: string;
  baseTemplateSlug?: string;
  documentContent?: DocumentContent;
}

export interface ContractCalculations {
  jaarbedrag: number;
  maandbedrag: number;
  ondergrens: number;
  bovengrens: number;
  kunstbudget: number;
}
