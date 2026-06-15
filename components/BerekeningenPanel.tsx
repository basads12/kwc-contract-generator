"use client";

import NumericInput from "@/components/NumericInput";
import type { ContractFormData } from "@/lib/types";
import {
  applyAdressenOrTariefChange,
  applyJaarbedragChange,
  applyKunstbudgetChange,
  applyMaandbedragChange,
  applySuggestedCalculations,
} from "@/lib/calculations";

interface BerekeningenFieldsProps {
  data: ContractFormData;
  onChange: (data: ContractFormData) => void;
  inputClass: string;
}

export default function BerekeningenFields({
  data,
  onChange,
  inputClass,
}: BerekeningenFieldsProps) {
  function update<K extends keyof ContractFormData>(
    key: K,
    value: ContractFormData[K]
  ) {
    onChange({ ...data, [key]: value });
  }

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs leading-relaxed text-zinc-500">
          Jaarbedrag = adressen × tarief (minimum € 2.400 excl. btw). Adressen,
          tarief en jaarbedrag passen automatisch op elkaar aan. Maandbedrag en
          kunstbudget volgen het jaarbedrag. Onder- en bovengrens (70%/130%)
          worden bijgewerkt bij wijziging van adressen of tarief.
        </p>
        <button
          type="button"
          onClick={() => onChange(applySuggestedCalculations(data))}
          className="shrink-0 rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
        >
          Herbereken
        </button>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Aantal adressen per jaar
            </label>
            <NumericInput
              className={inputClass}
              min={0}
              value={data.aantalAdressenPerJaar}
              onChange={(value) =>
                onChange(
                  applyAdressenOrTariefChange(
                    data,
                    "aantalAdressenPerJaar",
                    value
                  )
                )
              }
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Tarief per adres (€)
            </label>
            <NumericInput
              className={inputClass}
              min={0}
              allowDecimals
              value={data.tariefPerAdres}
              onChange={(value) =>
                onChange(
                  applyAdressenOrTariefChange(data, "tariefPerAdres", value)
                )
              }
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            Jaarbedrag (€)
          </label>
          <NumericInput
            className={inputClass}
            min={0}
            allowDecimals
            value={data.jaarbedrag}
            onChange={(value) => onChange(applyJaarbedragChange(data, value))}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Minimum € 2.400 excl. btw
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            Maandbedrag (€)
          </label>
          <NumericInput
            className={inputClass}
            min={0}
            allowDecimals
            value={data.maandbedrag}
            onChange={(value) => onChange(applyMaandbedragChange(data, value))}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Ondergrens (70%)
            </label>
            <NumericInput
              className={inputClass}
              min={0}
              value={data.ondergrens}
              onChange={(value) => update("ondergrens", value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-zinc-600">
              Bovengrens (130%)
            </label>
            <NumericInput
              className={inputClass}
              min={0}
              value={data.bovengrens}
              onChange={(value) => update("bovengrens", value)}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            Kunstbudget (€)
          </label>
          <NumericInput
            className={inputClass}
            min={0}
            allowDecimals
            value={data.kunstbudget}
            onChange={(value) => onChange(applyKunstbudgetChange(data, value))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-zinc-600">
            Betaaltermijn (dagen)
          </label>
          <NumericInput
            className={inputClass}
            min={1}
            value={data.betaaltermijnDagen}
            onChange={(value) => update("betaaltermijnDagen", value)}
          />
        </div>
      </div>
    </>
  );
}
