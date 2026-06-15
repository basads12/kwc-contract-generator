"use client";

import { useState } from "react";
import type { ContractFormData } from "@/lib/types";
import { buildTemplateSavePayload } from "@/lib/templateApply";

interface SaveTemplateModalProps {
  data: ContractFormData;
  open: boolean;
  onClose: () => void;
  onSaved: (template: {
    id: string;
    slug: string;
    name: string;
  }) => void;
  onMessage: (message: string) => void;
}

export default function SaveTemplateModal({
  data,
  open,
  onClose,
  onSaved,
  onMessage,
}: SaveTemplateModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clearClientFields, setClearClientFields] = useState(true);
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  async function handleSave() {
    if (!name.trim()) {
      onMessage("Geef het sjabloon een naam");
      return;
    }

    setSaving(true);
    try {
      const payload = buildTemplateSavePayload(data, { clearClientFields });
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
          defaultFormData: payload.defaultFormData,
          documentContent: payload.documentContent,
          baseTemplateSlug: payload.baseTemplateSlug,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Opslaan mislukt");

      onSaved({
        id: result.id,
        slug: result.slug,
        name: result.name,
      });
      onMessage(`Sjabloon opgeslagen: ${result.name}`);
      setName("");
      setDescription("");
      onClose();
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold text-zinc-900">
          Opslaan als nieuw sjabloon
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Sla de huidige formulierwaarden en documenttekst op als herbruikbaar
          sjabloon.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">
              Naam
            </span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Bijv. KWC met proefperiode 2026"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-zinc-700">
              Omschrijving (optioneel)
            </span>
            <textarea
              className="min-h-16 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <label className="flex items-start gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="mt-1"
              checked={clearClientFields}
              onChange={(e) => setClearClientFields(e.target.checked)}
            />
            <span>
              Klantgegevens en verantwoordelijken leegmaken (aanbevolen voor
              herbruikbare sjablonen)
            </span>
          </label>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            Annuleren
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {saving ? "Opslaan…" : "Sjabloon opslaan"}
          </button>
        </div>
      </div>
    </div>
  );
}
