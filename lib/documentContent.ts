import { SIJABLOON_1_SLUG } from "./templateConstants";

export interface DocumentArticleContent {
  title?: string;
  body: string;
}

export interface DocumentContent {
  fullText?: string;
  intro?: string;
  articles: Record<string, DocumentArticleContent>;
  continued?: string[];
}

const PAGE_BREAK_MARKER = "[pagina 2]";

export const DOCUMENT_PLACEHOLDER_HELP = [
  "{{bestedingsgrens}}",
  "{{waardeKwc}}",
  "{{ingangsdatum}}",
  "{{looptijdJaren}}",
  "{{aantalBestaandeKlanten}}",
  "{{portokostenTekst}}",
  "{{deadlineNawLevering}}",
  "{{aantalAdressenPerJaar}}",
  "{{tariefPerAdres}}",
  "{{jaarbedrag}}",
  "{{maandbedrag}}",
  "{{ondergrens}}",
  "{{bovengrens}}",
  "{{kunstbudget}}",
  "{{betaaltermijnDagen}}",
  "{{geldigheidsduurKwcMaanden}}",
  "{{proefperiodeMaanden}}",
].join(", ");

export const SIJABLOON_1_DOCUMENT_CONTENT: DocumentContent = {
  intro:
    "Hierbij treft u onze overeenkomst aan inzake het concept Kunst-Waardecheques (hierna te noemen \u201cKWC\u201d). Wij hebben deze overeenkomst bewust helder en evenwichtig opgesteld. De actie wordt voor u kosteloos en zonder risico uitgevoerd: de organisatie, de kosten en de afhandeling van eventuele klachten nemen wij volledig voor onze rekening, en gedurende de proefperiode kunt u eenvoudig en zonder kosten terug. Onderstaande afspraken leggen vast hoe wij dit zorgvuldig en met respect voor uw klanten en hun gegevens voor u verzorgen.",
  articles: {
    "1": {
      body: "U verstrekt aan iedere klant met een besteding boven de {{bestedingsgrens}} een KWC ter waarde van {{waardeKwc}}. Deze KWC kan worden ingewisseld bij Galerie De Kunst van Kunst.",
    },
    "2": {
      body: "Het is ons uitdrukkelijk verboden de door u verstrekte gegevens te gebruiken voor andere doeleinden dan de KWC. Wij zullen ons als verwerker houden aan alle verplichtingen voortvloeiend uit de AVG (zie Bijlage 1). De geldigheidsduur van de KWC is {{geldigheidsduurKwcMaanden}}. Wij zullen de klanten namens u tijdig herinneren per telefoon, e-mail of post en, indien gewenst, de geldigheidsduur verlengen.",
    },
    "3": {
      body: "Op vertoon van de KWC kan men een schilderij uitzoeken ter waarde van maximaal {{waardeKwc}}. Bij een lager bedrag bestaat geen recht op uitbetaling van het verschil. Indien men een duurder schilderij wenst aan te schaffen, ontvangt men namens uw bedrijf 25% tot 50% korting op de eventuele bijbetaling, zonder dat hier voor u kosten aan verbonden zijn. De KWC is niet geldig voor lijsten, lakken, bezorging of andere aanvullende diensten; indien klanten hiervan gebruikmaken, worden deze kosten rechtstreeks bij hen in rekening gebracht. De KWC is overdraagbaar. Indien klanten geen geschikt schilderij vinden en de KWC niet willen overdragen, kunnen zij in opdracht een schilderij laten maken op onze kosten of ontvangen zij een passende attentie.",
    },
    "4": {
      body: "Wij verzorgen voor uw bestaande klanten van de afgelopen drie jaar {{aantalBestaandeKlanten}} stuks geheel kosteloos een gratis KWC ter waarde van {{waardeKwc}}. Hiervoor betaalt u uitsluitend de portokosten{{portokostenTekst}}, Galerie De Kunst van Kunst bepaalt zelf het verstuurmoment van deze adressen. Alle adressen worden door ons vooraf ontdubbeld. U verstrekt ons voor {{deadlineNawLevering}} daartoe alle NAW-gegevens, inclusief telefoonnummer en e-mailadres, waarna wij deze klanten per post en e-mail informeren met een ambassadeursbrief, brochure en KWC. Deze adressen ontvangen wij graag binnen twee weken na ondertekening, in het Excel-bestand dat wij u per e-mail toesturen. Van de brochure, ambassadeursbrief en KWC heeft u reeds een concept ontvangen. U ontvangt deze ook digitaal, zodat eventuele gewenste aanpassingen kunnen worden doorgevoerd. Een belangrijk onderdeel van het concept is dat op zowel de brief als de brochure vier logo's in full colour worden geplaatst, met de vermelding dat deze actie mede mogelijk wordt gemaakt door de betrokken bedrijven. Dit verhoogt de waardebeleving en geloofwaardigheid voor de consument. De door ons aangedragen bedrijven kunnen in onderling overleg worden vervangen door de door u aangeleverde bedrijven.",
    },
    "5": {
      body: "Vanaf {{ingangsdatum}} overhandigt u na de verkoop uw klanten persoonlijk een aankondigingskaartje (van ons voor u). Dit kaartje kunt u ook fysiek en/of digitaal meesturen bij de factuur of als gedrukt exemplaar worden toegevoegd bij aflevering. Hierop staat vermeld dat de klant op korte termijn een verrassing van u zal ontvangen. U voert de NAW-gegevens, inclusief telefoon en e-mail, in van klanten die recht hebben op een KWC. Wij leveren u hiervoor een Excel-bestand aan dat u volledig ingevuld aan ons terugstuurt. U dient deze adressen tweewekelijks aan te leveren. Na ongeveer twee weken ontvangen uw klanten de brochure, ambassadeursbrief en KWC waarin het geschenk nader wordt toegelicht. Conform de AVG kan men zich via deze mail desgewenst uitschrijven.",
    },
    "6": {
      body: "De overeenkomst loopt vanaf {{ingangsdatum}} voor de duur van {{looptijdJaren}}. Na afloop van deze termijn kan de overeenkomst dagelijks worden opgezegd met een opzegtermijn van twaalf maanden.",
    },
    "7": {
      body: "U levert in het eerste contractjaar, ingaande per {{ingangsdatum}}, jaarlijks {{aantalAdressenPerJaar}} adressen per jaar tegen een tarief van {{tariefPerAdres}} per adres ({{jaarbedrag}} per jaar). Dit bedrag wordt in twaalf gelijke maandelijkse termijnen van {{maandbedrag}}.",
    },
    "8": {
      body: "U heeft gedurende de overeenkomst recht op een budget aan kunst uit onze galerie ter hoogte van 100% van het bedrag van het eerste jaar (zie punt 7: {{kunstbudget}} inclusief btw). Dit tegen commerciële prijzen in overeenstemming met de prijslijst van de galerie. Lijsten zijn hierbij niet inbegrepen.",
    },
    "9": {
      body: "Wij factureren u vanaf {{ingangsdatum}} maandelijks {{maandbedrag}} exclusief btw. Betaling dient te geschieden binnen {{betaaltermijnDagen}}.",
    },
    "10": {
      body: "De KWC wordt uitsluitend ingezet als aftersalesgeschenk en mag niet worden gebruikt als verkoopargument of in reclame-uitingen.",
    },
    "11": {
      body: "Essentieel voor het concept is de waardebeleving van de schilderijen. Partijen verplichten zich tot geheimhouding van de onderlinge afspraken rondom dit concept.",
    },
    "12": {
      body: "Eventuele klachten van bezoekers worden altijd in overeenstemming met het protocol klachtenafhandeling (zie Bijlage 2) afgehandeld.",
    },
    "13": {
      body: "Bij niet-nakoming van deze overeenkomst is de overtredende partij een boete verschuldigd van {{boete1000}} per gebeurtenis, onverminderd het recht op volledige schadevergoeding. Met name de punten 1, 2, 10, 11 en 12 zijn hierbij essentieel.",
    },
    "14": {
      body: "Het BP-arrangement wordt kosteloos aangeboden. De samenstelling kan door Galerie De Kunst van Kunst worden aangepast of aangevuld, mits de minimale commerciële waarde van {{bpMinimum}} behouden blijft.",
    },
    "15": {
      title: "Proefperiode.",
      body: "Zie bijlage 4.",
    },
  },
  continued: [
    "Zonder opzegging wordt de overeenkomst onder dezelfde condities, met toepassing van CPI-indexering, voortgezet.",
    "Het uitgangspunt binnen de samenwerking is een stabiele aanlevering van {{aantalAdressenPerJaar}} adressen per jaar, conform artikel 1. Om flexibiliteit te bieden bij onvoorziene omstandigheden hanteren wij een bandbreedte van 70% tot 130% ({{ondergrens}} en {{bovengrens}} adressen per jaar) zonder directe verrekening. Indien de aanlevering buiten deze bandbreedte valt, wordt dit op evenwichtige wijze gecorrigeerd: boven {{bovengrens}} adressen geldt een korting van 30% over het meerdere en onder de {{ondergrens}} adressen een toeslag van 30% over het tekort.",
  ],
};

function formatArticleLine(number: number, article: DocumentArticleContent): string {
  const prefix = article.title ? `${number}. ${article.title} ` : `${number}. `;
  return `${prefix}${article.body}`.trim();
}

function parseNumberedBlocks(text: string): Record<string, DocumentArticleContent> {
  const articles: Record<string, DocumentArticleContent> = {};
  const regex = /^(\d+)\.\s*([\s\S]*?)(?=^\d+\.\s+|$)/gm;
  let match = regex.exec(text);
  while (match) {
    articles[match[1]] = { body: match[2].trim() };
    match = regex.exec(text);
  }
  return articles;
}

export function serializeDocumentToFullText(content: DocumentContent): string {
  if (content.fullText?.trim()) return content.fullText;

  const parts: string[] = [];
  if (content.intro?.trim()) parts.push(content.intro.trim());

  const numbers = Object.keys(content.articles)
    .map(Number)
    .sort((a, b) => a - b);

  for (const number of numbers.filter((value) => value <= 6)) {
    const article = content.articles[String(number)];
    if (article) parts.push(formatArticleLine(number, article));
  }

  parts.push(PAGE_BREAK_MARKER);

  for (const paragraph of content.continued ?? []) {
    if (paragraph.trim()) parts.push(paragraph.trim());
  }

  for (const number of numbers.filter((value) => value >= 7)) {
    const article = content.articles[String(number)];
    if (article) parts.push(formatArticleLine(number, article));
  }

  return parts.join("\n\n");
}

export function parseFullTextToStructured(
  fullText: string
): Pick<DocumentContent, "intro" | "articles" | "continued"> {
  const [page1 = "", page2 = ""] = fullText.split(/\[pagina\s*2\]/i);
  const introMatch = page1.match(/^([\s\S]*?)(?=^1\.\s+)/m);
  const intro = introMatch ? introMatch[1].trim() : page1.trim();
  const page1Articles = parseNumberedBlocks(
    introMatch ? page1.slice(introMatch[0].length) : page1
  );

  const firstArticleOnPage2 = page2.match(/^(\d+)\.\s+/m);
  let continued: string[] = [];
  let page2Articles: Record<string, DocumentArticleContent> = {};

  if (firstArticleOnPage2) {
    const splitIndex = page2.indexOf(firstArticleOnPage2[0]);
    continued = page2
      .slice(0, splitIndex)
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
    page2Articles = parseNumberedBlocks(page2.slice(splitIndex));
  } else if (page2.trim()) {
    continued = page2
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  return {
    intro: intro || undefined,
    articles: { ...page1Articles, ...page2Articles },
    continued: continued.length > 0 ? continued : undefined,
  };
}

export function resolveDocumentContent(
  content?: DocumentContent | null
): DocumentContent {
  const defaults = structuredClone(SIJABLOON_1_DOCUMENT_CONTENT);
  if (!content) return defaults;

  return {
    intro: content.intro ?? defaults.intro,
    articles: { ...defaults.articles, ...content.articles },
    continued: content.continued ?? defaults.continued,
  };
}

export function updateDocumentFullText(
  current: DocumentContent,
  fullText: string
): DocumentContent {
  const parsed = parseFullTextToStructured(fullText);
  return {
    ...current,
    fullText,
    intro: parsed.intro,
    articles: parsed.articles,
    continued: parsed.continued,
  };
}

export function getDefaultDocumentContent(
  templateSlug: string
): DocumentContent | undefined {
  if (templateSlug === SIJABLOON_1_SLUG) {
    return structuredClone(SIJABLOON_1_DOCUMENT_CONTENT);
  }
  return undefined;
}

export function mergeDocumentContent(
  base?: DocumentContent | null,
  override?: DocumentContent | null
): DocumentContent | undefined {
  if (!base && !override) return undefined;
  if (!base) return override ? structuredClone(override) : undefined;
  if (!override) return structuredClone(base);

  const merged: DocumentContent = {
    fullText: override.fullText ?? base.fullText,
    intro: override.intro ?? base.intro,
    articles: { ...base.articles },
    continued: override.continued ?? base.continued,
  };

  for (const [key, article] of Object.entries(override.articles ?? {})) {
    merged.articles[key] = {
      title: article.title ?? base.articles[key]?.title,
      body: article.body,
    };
  }

  return merged;
}

export function parseDocumentContent(data: unknown): DocumentContent | undefined {
  if (!data || typeof data !== "object") return undefined;
  const value = data as DocumentContent;

  if (typeof value.fullText === "string" && value.fullText.trim()) {
    const parsed = parseFullTextToStructured(value.fullText);
    return {
      intro: parsed.intro,
      articles: parsed.articles,
      continued: parsed.continued,
    };
  }

  if (!value.articles || typeof value.articles !== "object") return undefined;
  return structuredClone(value);
}
