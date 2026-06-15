const DUTCH_NUMBERS: Record<number, string> = {
  1: "een",
  2: "twee",
  3: "drie",
  4: "vier",
  5: "vijf",
  6: "zes",
  7: "zeven",
  8: "acht",
  9: "negen",
  10: "tien",
  11: "elf",
  12: "twaalf",
  13: "dertien",
  14: "veertien",
  15: "vijftien",
  16: "zestien",
  17: "zeventien",
  18: "achttien",
  19: "negentien",
  20: "twintig",
  21: "eenentwintig",
  22: "tweeëntwintig",
  23: "drieëntwintig",
  24: "vierentwintig",
  25: "vijfentwintig",
  26: "zesentwintig",
  27: "zevenentwintig",
  28: "achtentwintig",
  29: "negenentwintig",
  30: "dertig",
};

function formatNumberNL(value: number, decimals = 0): string {
  return value.toLocaleString("nl-NL", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const WORD_JOINER = "\u2060";

function formatCurrencyCore(amount: number, decimals: number, suffix = ""): string {
  const formatted = formatNumberNL(
    decimals === 0 ? Math.round(amount) : amount,
    decimals
  );
  return `€${WORD_JOINER}${formatted}${suffix}`;
}

export function formatCurrency(amount: number): string {
  return formatCurrencyCore(amount, 0, ",-");
}

export function formatCurrencyDecimal(amount: number): string {
  return formatCurrencyCore(amount, 2);
}

export function formatDateShort(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
}

export function formatDateLong(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso + "T12:00:00");
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateDayMonth(iso: string): string {
  if (!iso) return "";
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
  });
}

export function formatBetaaltermijn(dagen: number): string {
  if (DUTCH_NUMBERS[dagen]) {
    return `${DUTCH_NUMBERS[dagen]} dagen`;
  }
  return `${dagen} dagen`;
}

export function formatAantalBestaandeKlanten(aantal: number): string {
  if (aantal <= 0) return "_______";
  return String(aantal);
}

export function formatPortokosten(portokosten: string): string {
  if (!portokosten.trim()) return "";
  return ` (${portokosten.trim()})`;
}

export function formatGeldigheidsduur(maanden: number): string {
  if (DUTCH_NUMBERS[maanden]) {
    return `${DUTCH_NUMBERS[maanden]} maanden`;
  }
  return `${maanden} maanden`;
}

export function formatLooptijd(jaren: number): string {
  if (DUTCH_NUMBERS[jaren]) {
    return `${DUTCH_NUMBERS[jaren]} jaar`;
  }
  return `${jaren} jaar`;
}

export function formatCurrencyArt7Monthly(amount: number): string {
  const formatted = formatNumberNL(Math.round(amount), 0);
  return `€${WORD_JOINER}${formatted},-${WORD_JOINER}exclusief btw gefactureerd`;
}
