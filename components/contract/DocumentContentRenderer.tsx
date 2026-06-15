import type { ContractCalculations, ContractFormData } from "@/lib/types";
import {
  getDefaultDocumentContent,
  type DocumentContent,
} from "@/lib/documentContent";
import { renderDocumentText, type DocumentRenderContext } from "@/lib/renderDocumentText";
import { SIJABLOON_1_SLUG } from "@/lib/templateConstants";
import { Article } from "./shared";

interface DocumentContentRendererProps {
  data: ContractFormData;
  calculations: ContractCalculations;
  content?: DocumentContent;
}

function resolveContent(
  data: ContractFormData,
  content?: DocumentContent
): DocumentContent {
  return (
    content ??
    data.documentContent ??
    getDefaultDocumentContent(SIJABLOON_1_SLUG) ?? { articles: {} }
  );
}

export default function DocumentContentRenderer({
  data,
  calculations,
  content,
}: DocumentContentRendererProps) {
  const resolved = resolveContent(data, content);
  const context: DocumentRenderContext = { data, calculations };
  const articleNumbers = Object.keys(resolved.articles)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      {resolved.intro ? (
        <p className="contract-intro contract-intro--classic">
          {renderDocumentText(resolved.intro, context)}
        </p>
      ) : null}

      {articleNumbers
        .filter((number) => number <= 6)
        .map((number) => {
          const article = resolved.articles[String(number)];
          if (!article) return null;
          return (
            <Article key={number} number={number} title={article.title}>
              {renderDocumentText(article.body, context)}
            </Article>
          );
        })}
    </>
  );
}

export function DocumentContentRendererPage2({
  data,
  calculations,
  content,
}: DocumentContentRendererProps) {
  const resolved = resolveContent(data, content);
  const context: DocumentRenderContext = { data, calculations };
  const articleNumbers = Object.keys(resolved.articles)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      {(resolved.continued ?? []).map((paragraph, index) => (
        <p key={`continued-${index}`} className="contract-article-continued">
          {renderDocumentText(paragraph, context)}
        </p>
      ))}

      {articleNumbers
        .filter((number) => number >= 7)
        .map((number) => {
          const article = resolved.articles[String(number)];
          if (!article) return null;
          return (
            <Article key={number} number={number} title={article.title}>
              {renderDocumentText(article.body, context)}
            </Article>
          );
        })}
    </>
  );
}
