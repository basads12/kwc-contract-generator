"use client";

import { useState } from "react";

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  allowDecimals?: boolean;
}

function formatValue(value: number, allowDecimals: boolean): string {
  if (!Number.isFinite(value) || value === 0) return "";
  if (allowDecimals) return String(value);
  return String(Math.trunc(value));
}

function parseDraft(raw: string, allowDecimals: boolean): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "" || normalized === "-") return null;

  const parsed = allowDecimals
    ? Number.parseFloat(normalized)
    : Number.parseInt(normalized, 10);

  if (!Number.isFinite(parsed)) return null;
  return allowDecimals ? Math.round(parsed * 100) / 100 : parsed;
}

function isValidDraft(raw: string, allowDecimals: boolean): boolean {
  return allowDecimals ? /^-?\d*(?:[.,]\d*)?$/.test(raw) : /^-?\d*$/.test(raw);
}

export default function NumericInput({
  value,
  onChange,
  className,
  min,
  allowDecimals = false,
}: NumericInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatValue(value, allowDecimals);

  function commit(nextDraft: string) {
    const parsed = parseDraft(nextDraft, allowDecimals);
    if (parsed === null) return;
    onChange(min !== undefined ? Math.max(min, parsed) : parsed);
  }

  return (
    <input
      type="text"
      inputMode={allowDecimals ? "decimal" : "numeric"}
      className={className}
      value={display}
      onFocus={() => setDraft(formatValue(value, allowDecimals))}
      onChange={(e) => {
        const next = e.target.value;
        if (!isValidDraft(next, allowDecimals)) return;
        setDraft(next);
      }}
      onBlur={() => {
        if (draft !== null) commit(draft);
        setDraft(null);
      }}
    />
  );
}
