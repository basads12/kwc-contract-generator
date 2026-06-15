import type { ContractStatus } from "@prisma/client";

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  CONCEPT: "Concept",
  KLAAR_VOOR_ONDERTEKENING: "Klaar voor ondertekening",
  GETEKEND: "Getekend",
  KLANTLINK_VERZONDEN: "Klantlink verzonden",
  INCASSO_VOORBEREID: "Incasso voorbereid",
  AFGEROND: "Afgerond",
};

export const CONTRACT_STATUS_ORDER: ContractStatus[] = [
  "CONCEPT",
  "KLAAR_VOOR_ONDERTEKENING",
  "GETEKEND",
  "KLANTLINK_VERZONDEN",
  "INCASSO_VOORBEREID",
  "AFGEROND",
];

const UNLOCKED_TRANSITIONS: Partial<
  Record<ContractStatus, ContractStatus[]>
> = {
  CONCEPT: ["CONCEPT", "KLAAR_VOOR_ONDERTEKENING"],
  KLAAR_VOOR_ONDERTEKENING: ["KLAAR_VOOR_ONDERTEKENING", "CONCEPT"],
};

const LOCKED_TRANSITIONS: Partial<Record<ContractStatus, ContractStatus[]>> = {
  GETEKEND: ["KLANTLINK_VERZONDEN", "INCASSO_VOORBEREID"],
  KLANTLINK_VERZONDEN: ["INCASSO_VOORBEREID"],
  INCASSO_VOORBEREID: ["AFGEROND", "KLANTLINK_VERZONDEN", "GETEKEND"],
};

export function canSignContract(status: ContractStatus, locked: boolean): boolean {
  return !locked && status === "KLAAR_VOOR_ONDERTEKENING";
}

export function canTransitionStatus(
  from: ContractStatus,
  to: ContractStatus,
  locked: boolean
): boolean {
  if (from === to) return true;
  if (!locked) {
    return UNLOCKED_TRANSITIONS[from]?.includes(to) ?? false;
  }
  return LOCKED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getStatusAfterIncassoAcknowledge(
  current: ContractStatus,
  acknowledged: boolean
): ContractStatus {
  if (acknowledged) {
    if (
      current === "KLANTLINK_VERZONDEN" ||
      current === "GETEKEND"
    ) {
      return "INCASSO_VOORBEREID";
    }
    return current;
  }
  if (current === "INCASSO_VOORBEREID") {
    return "KLANTLINK_VERZONDEN";
  }
  return current;
}

export function getStatusBadgeClass(status: ContractStatus): string {
  const map: Record<ContractStatus, string> = {
    CONCEPT: "bg-zinc-100 text-zinc-700",
    KLAAR_VOOR_ONDERTEKENING: "bg-amber-100 text-amber-800",
    GETEKEND: "bg-blue-100 text-blue-800",
    KLANTLINK_VERZONDEN: "bg-indigo-100 text-indigo-800",
    INCASSO_VOORBEREID: "bg-purple-100 text-purple-800",
    AFGEROND: "bg-green-100 text-green-800",
  };
  return map[status];
}

export function isValidContractStatus(value: string): value is ContractStatus {
  return CONTRACT_STATUS_ORDER.includes(value as ContractStatus);
}
