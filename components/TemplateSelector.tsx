"use client";

import { useEffect, useRef, useState } from "react";
import { applyTemplateRecord, type TemplateRecordPayload } from "@/lib/templateApply";

interface TemplateRecord extends TemplateRecordPayload {
  id: string;
  name: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
  isBuiltIn: boolean;
}

interface TemplateSelectorProps {
  currentSlug: string;
  disabled?: boolean;
  reloadToken?: number;
  onApply: (template: TemplateRecord) => void;
  onMessage: (message: string) => void;
}

export default function TemplateSelector({
  currentSlug,
  disabled = false,
  reloadToken = 0,
  onApply,
  onMessage,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadTemplates() {
    const res = await fetch("/api/templates");
    const data = await res.json();
    if (Array.isArray(data)) setTemplates(data);
  }

  useEffect(() => {
    loadTemplates().finally(() => setLoading(false));
  }, [reloadToken]);

  function handleSelect(slug: string) {
    const template = templates.find((item) => item.slug === slug);
    if (!template) return;
    onApply(template);
    onMessage(`Sjabloon geladen: ${template.name}`);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", file.name.replace(/\.[^.]+$/, ""));
      const res = await fetch("/api/templates", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload mislukt");
      setTemplates((prev) => [...prev, data]);
      onApply(data);
      onMessage(`Sjabloon geüpload: ${data.name}`);
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Upload mislukt");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(template: TemplateRecord) {
    if (template.isBuiltIn) return;
    if (!window.confirm(`Sjabloon "${template.name}" verwijderen?`)) return;

    setDeletingId(template.id);
    try {
      const res = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Verwijderen mislukt");
      setTemplates((prev) => prev.filter((item) => item.id !== template.id));
      onMessage(`Sjabloon verwijderd: ${template.name}`);
    } catch (error) {
      onMessage(error instanceof Error ? error.message : "Verwijderen mislukt");
    } finally {
      setDeletingId(null);
    }
  }

  const current = templates.find((item) => item.slug === currentSlug);

  return (
    <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="contract-form-section__title mb-3 border-0 pb-0">
        Sjabloon overeenkomst
      </h2>
      <div className="flex flex-col gap-2">
        <select
          className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          value={currentSlug}
          disabled={disabled || loading}
          onChange={(e) => handleSelect(e.target.value)}
        >
          {loading ? (
            <option value={currentSlug}>Sjablonen laden…</option>
          ) : (
            templates.map((template) => (
              <option key={template.id} value={template.slug}>
                {template.name}
                {template.isBuiltIn
                  ? ""
                  : template.fileUrl
                    ? " (geüpload)"
                    : " (eigen)"}
              </option>
            ))
          )}
        </select>
        {current?.description ? (
          <p className="text-xs leading-relaxed text-zinc-500">
            {current.description}
          </p>
        ) : null}
        {current?.fileUrl ? (
          <a
            href={current.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-zinc-600 underline"
          >
            Bronbestand: {current.fileName ?? "download"}
          </a>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
            }}
          />
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            {uploading ? "Uploaden…" : "Referentie uploaden (DOCX/PDF)"}
          </button>
          {current && !current.isBuiltIn && !current.fileUrl ? (
            <button
              type="button"
              disabled={disabled || deletingId === current.id}
              onClick={() => void handleDelete(current)}
              className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              {deletingId === current.id ? "Verwijderen…" : "Sjabloon verwijderen"}
            </button>
          ) : null}
        </div>
        <p className="text-xs text-zinc-500">
          Kies een sjabloon, bewerk de documenttekst en sla op als nieuw
          sjabloon. Eigen sjablonen bewaren formulierstandaarden en
          aangepaste artikelteksten.
        </p>
      </div>
    </div>
  );
}
