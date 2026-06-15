function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function daysBetween(startIso: string, endIso: string): number {
  const start = new Date(`${startIso}T12:00:00`);
  const end = new Date(`${endIso}T12:00:00`);
  return Math.round((end.getTime() - start.getTime()) / 86_400_000);
}

function clampBetween(iso: string, min: string, max: string): string {
  if (iso < min) return min;
  if (iso > max) return max;
  return iso;
}

/** Ingangsdatum altijd op de 1e van de maand */
export function normalizeIngangsdatum(iso: string): string {
  if (!iso) return iso;
  const [year, month] = iso.split("-");
  return `${year}-${month}-01`;
}

/** Standaard: 1e van de maand na datum overeenkomst */
export function deriveIngangsdatum(datumOvereenkomst: string): string {
  if (!datumOvereenkomst) return "";
  const [year, month] = datumOvereenkomst.split("-").map(Number);
  let nextYear = year;
  let nextMonth = month + 1;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  return `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`;
}

export function syncNawDeadlineDates(deadline: string) {
  return {
    deadlineNawLevering: deadline,
    datumAdresgegevens: deadline,
  };
}

/** Logo: standaard 2 weken na ondertekening; eerder bij krappe planning */
function deriveDatumLogo(
  datumOvereenkomst: string,
  ingangsdatum: string
): string {
  const daysToStart = daysBetween(datumOvereenkomst, ingangsdatum);
  const logoOffset =
    daysToStart < 35 ? Math.max(7, Math.floor(daysToStart * 0.3)) : 14;

  return clampBetween(
    addDays(datumOvereenkomst, logoOffset),
    datumOvereenkomst,
    addDays(ingangsdatum, -1)
  );
}

/** Adressen: vóór ingangsdatum (standaard 2 weken, minimaal 3 dagen) */
function deriveDatumAdresgegevens(
  datumOvereenkomst: string,
  ingangsdatum: string
): string {
  const daysToStart = daysBetween(datumOvereenkomst, ingangsdatum);
  const offsetBeforeStart = Math.min(
    14,
    Math.max(3, Math.floor(daysToStart * 0.2))
  );

  return clampBetween(
    addDays(ingangsdatum, -offsetBeforeStart),
    datumOvereenkomst,
    addDays(ingangsdatum, -1)
  );
}

/** Proefdruk akkoord: minimaal 7 dagen na logo, vóór adresdeadline */
function deriveDatumAkkoordProefdruk(
  datumLogo: string,
  datumAdresgegevens: string,
  ingangsdatum: string
): string {
  const earliest = addDays(datumLogo, 7);
  const latest = addDays(datumAdresgegevens, -1);

  if (earliest > latest) {
    return clampBetween(
      addDays(datumLogo, 1),
      datumLogo,
      addDays(ingangsdatum, -1)
    );
  }

  return clampBetween(earliest, earliest, latest);
}

/**
 * Bijlage 3 + art. 4 — opvolging t.o.v. datum overeenkomst en ingangsdatum:
 * logo → proefdruk akkoord → adresgegevens → ingangsdatum
 */
export function deriveAdresaanleveringDates(
  datumOvereenkomst: string,
  ingangsdatum: string
) {
  const normalizedStart = normalizeIngangsdatum(ingangsdatum);
  const datumLogoAanlevering = deriveDatumLogo(
    datumOvereenkomst,
    normalizedStart
  );
  const datumAdresgegevens = deriveDatumAdresgegevens(
    datumOvereenkomst,
    normalizedStart
  );
  const datumAkkoordProefdruk = deriveDatumAkkoordProefdruk(
    datumLogoAanlevering,
    datumAdresgegevens,
    normalizedStart
  );
  const adjustedAdresgegevens = clampBetween(
    datumAdresgegevens,
    addDays(datumAkkoordProefdruk, 1),
    addDays(normalizedStart, -1)
  );

  return {
    ingangsdatum: normalizedStart,
    datumLogoAanlevering,
    datumAkkoordProefdruk,
    ...syncNawDeadlineDates(adjustedAdresgegevens),
  };
}

export function deriveContractDates(
  datumOvereenkomst: string,
  ingangsdatum?: string
) {
  const start = ingangsdatum
    ? normalizeIngangsdatum(ingangsdatum)
    : deriveIngangsdatum(datumOvereenkomst);

  return deriveAdresaanleveringDates(datumOvereenkomst, start);
}

/** Bij wijziging datum overeenkomst: ingangsdatum + alle aanleverdatums */
export function applyDatumOvereenkomstChange(datumOvereenkomst: string) {
  return deriveContractDates(datumOvereenkomst);
}

/** Bij wijziging ingangsdatum: alle aanleverdatums (ingangsdatum → 1e van de maand) */
export function applyIngangsdatumChange(
  data: { datumOvereenkomst: string },
  ingangsdatum: string
) {
  return deriveAdresaanleveringDates(
    data.datumOvereenkomst,
    ingangsdatum
  );
}
