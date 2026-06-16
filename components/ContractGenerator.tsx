"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ContractForm from "@/components/ContractForm";
import ContractPreview from "@/components/ContractPreview";
import SaveTemplateModal from "@/components/SaveTemplateModal";
import { calculateContractValues } from "@/lib/calculations";
import TemplateSelector from "@/components/TemplateSelector";
import { getEmptyValues } from "@/lib/defaultValues";
import { SIJABLOON_1_ID } from "@/lib/templateConstants";
import {
  applyTemplateRecord,
  ensureDocumentContent,
  getInitialFormData,
} from "@/lib/templateApply";
import { syncFormBandbreedte } from "@/lib/calculations";
import { printContractWithFilename } from "@/lib/contractPdfFilename";
import type { ContractFormData } from "@/lib/types";

interface ContractGeneratorProps {
  initialData?: ContractFormData;
  contractId?: string;
  contractNumber?: string;
  initialTemplateId?: string;
  locked?: boolean;
  readOnly?: boolean;
}

export default function ContractGenerator({
  initialData,
  contractId,
  contractNumber,
  initialTemplateId,
  locked = false,
  readOnly = false,
}: ContractGeneratorProps) {
  const [data, setData] = useState<ContractFormData>(() =>
    getInitialFormData(initialData)
  );
  const [templateId, setTemplateId] = useState<string>(
    initialTemplateId ?? SIJABLOON_1_ID
  );
  const [formKey, setFormKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [templateReloadToken, setTemplateReloadToken] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const calculations = useMemo(() => calculateContractValues(data), [data]);
  const isEditable = !locked && !readOnly;

  function handleReset() {
    if (!isEditable) return;
    setData(getEmptyValues(data.templateSlug));
    setFormKey((key) => key + 1);
    setMessage("Formulier geleegd");
  }

  function handlePrint() {
    printContractWithFilename(data.bedrijfsnaam, data.datumOvereenkomst);
  }

  async function handleSave(status: "CONCEPT" | "KLAAR_VOOR_ONDERTEKENING") {
    if (!isEditable) return;
    setSaving(true);
    setMessage(null);
    try {
      const url = contractId ? `/api/contracts/${contractId}` : "/api/contracts";
      const method = contractId ? "PATCH" : "POST";
      const payload = ensureDocumentContent(syncFormBandbreedte(data));
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: payload, status, templateId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Opslaan mislukt");

      setMessage(
        contractId
          ? `Opgeslagen (${result.contractNumber})`
          : `Concept aangemaakt: ${result.contractNumber}`
      );

      if (!contractId) {
        window.location.href = `/contracten/${result.id}`;
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 font-sans">
      <header className="no-print border-b border-zinc-200 bg-white px-4 py-4 lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-base font-semibold tracking-tight text-zinc-900">
              KWC Contract Generator
            </h1>
            {contractNumber && (
              <span className="text-sm text-zinc-500">{contractNumber}</span>
            )}
            {locked && (
              <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                Vergrendeld
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/contracten"
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Contracten
            </Link>
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/login";
              }}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Uitloggen
            </button>
            {isEditable && (
              <>
                <button
                  type="button"
                  onClick={() => setSaveTemplateOpen(true)}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Opslaan als sjabloon
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("CONCEPT")}
                  disabled={saving}
                  className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
                >
                  {saving ? "Opslaan…" : "Opslaan concept"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSave("KLAAR_VOOR_ONDERTEKENING")}
                  disabled={saving}
                  className="rounded-md border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                >
                  Klaar voor ondertekening
                </button>
              </>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Print / PDF
            </button>
          </div>
        </div>
        {message && (
          <p className="mt-2 text-sm text-zinc-600">{message}</p>
        )}
      </header>

      <SaveTemplateModal
        data={ensureDocumentContent(data)}
        open={saveTemplateOpen}
        onClose={() => setSaveTemplateOpen(false)}
        onSaved={(template) => {
          setTemplateId(template.id);
          setData((current) => ({
            ...current,
            templateSlug: template.slug,
          }));
          setTemplateReloadToken((token) => token + 1);
        }}
        onMessage={setMessage}
      />

      <div className="flex min-w-0 flex-col lg:flex-row">
        {isEditable && (
          <aside className="no-print w-full shrink-0 border-b border-zinc-200 bg-white lg:w-[30%] lg:border-b-0 lg:border-r">
            <div className="p-4 lg:p-6">
              <TemplateSelector
                currentSlug={data.templateSlug}
                disabled={!isEditable}
                reloadToken={templateReloadToken}
                onApply={(template) => {
                  const nextData = applyTemplateRecord(template);
                  setData(nextData);
                  setTemplateId(template.id);
                  setFormKey((key) => key + 1);
                }}
                onMessage={setMessage}
              />
              <ContractForm key={formKey} data={data} onChange={setData} />
            </div>
          </aside>
        )}

        <main
          className={`min-w-0 w-full ${isEditable ? "lg:w-[70%]" : ""} bg-zinc-200/70`}
        >
          <ContractPreview
            data={data}
            calculations={calculations}
            editable={isEditable}
            onDocumentContentChange={(documentContent) =>
              setData((current) => ({ ...current, documentContent }))
            }
          />
        </main>
      </div>
    </div>
  );
}
