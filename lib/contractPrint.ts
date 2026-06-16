import { buildContractPdfFilename } from "@/lib/contractPdfFilename";

export type ContractPrintScope = "hoofdcontract" | "bijlagen" | "alles";

export const CONTRACT_PRINT_SCOPE_ATTR = "data-contract-print-scope";

export const CONTRACT_PRINT_CLASS = {
  hoofdcontract: "contract-print-hoofdcontract",
  bijlage: "contract-print-bijlage",
  bijlageStart: "contract-print-bijlage-start",
} as const;

export const CONTRACT_PRINT_SCOPE_LABELS: Record<
  ContractPrintScope,
  { title: string; hint: string }
> = {
  hoofdcontract: {
    title: "Hoofdcontract",
    hint: "Kies in de printerdialoog: dubbelzijdig (pagina 1 op de voorzijde, pagina 2 op de achterzijde).",
  },
  bijlagen: {
    title: "Bijlagen",
    hint: "Kies in de printerdialoog: enkelzijdig. Druk de bijlagen apart af.",
  },
  alles: {
    title: "Volledig document",
    hint:
      "Advies: druk eerst het hoofdcontract dubbelzijdig af, daarna de bijlagen enkelzijdig (twee aparte printopdrachten).",
  },
};

function scopeFilenameSuffix(scope: ContractPrintScope): string {
  if (scope === "hoofdcontract") return " (hoofdcontract)";
  if (scope === "bijlagen") return " (bijlagen)";
  return "";
}

export function setContractPrintScope(scope: ContractPrintScope): () => void {
  document.documentElement.setAttribute(CONTRACT_PRINT_SCOPE_ATTR, scope);
  return () => {
    document.documentElement.removeAttribute(CONTRACT_PRINT_SCOPE_ATTR);
  };
}

export function printContractScoped(
  scope: ContractPrintScope,
  bedrijfsnaam: string,
  datumOvereenkomst: string
): void {
  const previousTitle = document.title;
  const baseName = buildContractPdfFilename(
    bedrijfsnaam,
    datumOvereenkomst
  ).replace(/\.pdf$/i, "");

  document.title = `${baseName}${scopeFilenameSuffix(scope)}`;

  const clearScope = setContractPrintScope(scope);

  const cleanup = () => {
    clearScope();
    document.title = previousTitle;
  };

  window.addEventListener("afterprint", cleanup, { once: true });
  window.print();
}
