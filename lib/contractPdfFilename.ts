export function formatDateCompact(iso: string): string {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}${month}${year}`;
}

function sanitizeFilenamePart(value: string): string {
  return value
    .trim()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

export function buildContractPdfFilename(
  bedrijfsnaam: string,
  datumOvereenkomst: string
): string {
  const date = formatDateCompact(datumOvereenkomst) || "onbekend";
  const company = sanitizeFilenamePart(bedrijfsnaam) || "onbekend";
  return `${date} overeenkomst ${company}.pdf`;
}

export function buildContractPdfBlobPath(
  contractNumber: string,
  bedrijfsnaam: string,
  datumOvereenkomst: string
): string {
  const filename = buildContractPdfFilename(bedrijfsnaam, datumOvereenkomst);
  return `contracts/${contractNumber}/${filename}`;
}

export function printContractWithFilename(
  bedrijfsnaam: string,
  datumOvereenkomst: string
): void {
  const previousTitle = document.title;
  document.title = buildContractPdfFilename(bedrijfsnaam, datumOvereenkomst).replace(
    /\.pdf$/i,
    ""
  );

  const restoreTitle = () => {
    document.title = previousTitle;
  };

  window.addEventListener("afterprint", restoreTitle, { once: true });
  window.print();
}
