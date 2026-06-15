"use client";

import { useMemo } from "react";
import type { ContractFormData } from "@/lib/types";
import {
  DOCUMENT_PLACEHOLDER_HELP,
  getDefaultDocumentContent,
  type DocumentArticleContent,
  type DocumentContent,
} from "@/lib/documentContent";
import { resolveBaseTemplateSlug } from "@/lib/templateApply";
import { SIJABLOON_1_SLUG } from "@/lib/templateConstants";

interface DocumentEditorProps {
  data: ContractFormData;
  onChange: (data: ContractFormData) => void;
}

function updateArticle(
  content: DocumentContent,
  number: number,
  patch: Partial<DocumentArticleContent>
): DocumentContent {
  const key = String(number);
  const current = content.articles[key] ?? { body: "" };
  return {
    ...content,
    articles: {
      ...content.articles,
      [key]: { ...current, ...patch },
    },
  };
}

export default function DocumentEditor({ data, onChange }: DocumentEditorProps) {
  const baseSlug = resolveBaseTemplateSlug(data.templateSlug, data.baseTemplateSlug);

  const content = useMemo(() => {
    return (
      data.documentContent ??
      getDefaultDocumentContent(baseSlug) ?? { articles: {} }
    );
  }, [data.documentContent, baseSlug]);

  if (baseSlug !== SIJABLOON_1_SLUG) {
    return (
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Documentbewerking is momenteel alleen beschikbaar voor sjabloon 1
        (15 artikelen). Sla het document op als nieuw sjabloon op basis van
        sjabloon 1 om de tekst aan te passen.
      </div>
    );
  }

  function patchContent(next: DocumentContent) {
    onChange({ ...data, documentContent: next });
  }

  const articleNumbers = Object.keys(content.articles)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="mb-5 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="contract-form-section__title mb-1 border-0 pb-0">
        Document bewerken
      </h2>
      <p className="mb-4 text-xs leading-relaxed text-zinc-500">
        Pas de contracttekst aan. Gebruik placeholders voor dynamische waarden:{" "}
        {DOCUMENT_PLACEHOLDER_HELP}.
      </p>

      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-medium text-zinc-700">
          Introductie
        </span>
        <textarea
          className="min-h-16 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          value={content.intro ?? ""}
          onChange={(e) => patchContent({ ...content, intro: e.target.value })}
        />
      </label>

      {articleNumbers.map((number) => {
        const article = content.articles[String(number)];
        return (
          <details key={number} className="mb-2 rounded-md border border-zinc-200">
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-zinc-800">
              Artikel {number}
              {article.title ? `: ${article.title}` : ""}
            </summary>
            <div className="space-y-2 border-t border-zinc-200 px-3 py-3">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-700">
                  Titel (optioneel)
                </span>
                <input
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={article.title ?? ""}
                  onChange={(e) =>
                    patchContent(updateArticle(content, number, { title: e.target.value }))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-zinc-700">
                  Tekst
                </span>
                <textarea
                  className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
                  value={article.body}
                  onChange={(e) =>
                    patchContent(updateArticle(content, number, { body: e.target.value }))
                  }
                />
              </label>
            </div>
          </details>
        );
      })}

      {(content.continued ?? []).map((paragraph, index) => (
        <label key={`continued-${index}`} className="mb-3 block">
          <span className="mb-1 block text-xs font-medium text-zinc-700">
            Voortzetting {index + 1}
          </span>
          <textarea
            className="min-h-20 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            value={paragraph}
            onChange={(e) => {
              const continued = [...(content.continued ?? [])];
              continued[index] = e.target.value;
              patchContent({ ...content, continued });
            }}
          />
        </label>
      ))}
    </div>
  );
}
