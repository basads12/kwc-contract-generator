"use client";

import { useEffect, useRef, useState } from "react";
import {
  CONTRACT_PRINT_SCOPE_LABELS,
  printContractScoped,
  type ContractPrintScope,
} from "@/lib/contractPrint";

interface PrintContractMenuProps {
  bedrijfsnaam: string;
  datumOvereenkomst: string;
  buttonClassName?: string;
  compact?: boolean;
}

const SCOPES: ContractPrintScope[] = ["hoofdcontract", "bijlagen", "alles"];

export default function PrintContractMenu({
  bedrijfsnaam,
  datumOvereenkomst,
  buttonClassName = "rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700",
  compact = false,
}: PrintContractMenuProps) {
  const [open, setOpen] = useState(false);
  const [activeHint, setActiveHint] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function handlePrint(scope: ContractPrintScope) {
    setActiveHint(CONTRACT_PRINT_SCOPE_LABELS[scope].hint);
    setOpen(false);
    printContractScoped(scope, bedrijfsnaam, datumOvereenkomst);
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={buttonClassName}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {compact ? "Print" : "Print / PDF"}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-md border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {SCOPES.map((scope) => {
            const { title, hint } = CONTRACT_PRINT_SCOPE_LABELS[scope];
            return (
              <button
                key={scope}
                type="button"
                role="menuitem"
                onClick={() => handlePrint(scope)}
                className="block w-full rounded px-3 py-2 text-left hover:bg-zinc-50"
              >
                <span className="block text-sm font-medium text-zinc-900">
                  {title}
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-zinc-500">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {activeHint ? (
        <p className="no-print mt-2 max-w-md text-xs leading-snug text-zinc-500">
          {activeHint}
        </p>
      ) : null}
    </div>
  );
}
