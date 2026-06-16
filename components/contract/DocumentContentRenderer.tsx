import type { ContractCalculations, ContractFormData } from "@/lib/types";
import {
  getDefaultDocumentContent,
  resolveDocumentContent,
  type DocumentContent,
} from "@/lib/documentContent";
import { type DocumentRenderContext, normalizeIntroProefperiodeTemplate } from "@/lib/renderDocumentText";
import { SIJABLOON_1_SLUG, MAIN_CONTRACT_PAGE1_LAST_ARTICLE } from "@/lib/templateConstants";
import { Article } from "./shared";
import EditableDocumentText from "./EditableDocumentText";

interface DocumentContentRendererProps {
  data: ContractFormData;
  calculations: ContractCalculations;
  content?: DocumentContent;
  editable?: boolean;
  onContentChange?: (content: DocumentContent) => void;
}

function resolveContent(
  data: ContractFormData,
  content?: DocumentContent
): DocumentContent {
  const source =
    content ??
    data.documentContent ??
    getDefaultDocumentContent(SIJABLOON_1_SLUG) ?? { articles: {} };
  return resolveDocumentContent(source);
}

function patchContent(
  current: DocumentContent,
  patch: Partial<DocumentContent>
): DocumentContent {
  return {
    ...current,
    ...patch,
    articles: patch.articles ?? current.articles,
  };
}

function patchArticle(
  current: DocumentContent,
  number: number,
  body: string,
  title?: string
): DocumentContent {
  const key = String(number);
  const existing = current.articles[key];
  return patchContent(current, {
    articles: {
      ...current.articles,
      [key]: {
        title: title ?? existing?.title,
        body,
      },
    },
  });
}

function renderArticleBody(
  template: string,
  context: DocumentRenderContext,
  editable: boolean | undefined,
  onChange: ((next: string) => void) | undefined,
  title?: string
) {
  if (title) {
    return (
      <>
        <span className="contract-article__title">{title}</span>{" "}
        <EditableDocumentText
          template={template}
          context={context}
          editable={editable}
          onTemplateChange={onChange}
        />
      </>
    );
  }

  return (
    <EditableDocumentText
      template={template}
      context={context}
      editable={editable}
      onTemplateChange={onChange}
    />
  );
}

function shouldRenderArticle(number: number, data: ContractFormData): boolean {
  if (number === 15 && !data.proefperiodeActief) return false;
  return true;
}

function visibleArticleNumbers(
  articles: DocumentContent["articles"],
  data: ContractFormData
): number[] {
  return Object.keys(articles)
    .map(Number)
    .filter((number) => shouldRenderArticle(number, data))
    .sort((a, b) => a - b);
}

export default function DocumentContentRenderer({
  data,
  calculations,
  content,
  editable,
  onContentChange,
}: DocumentContentRendererProps) {
  const resolved = resolveContent(data, content);
  const context: DocumentRenderContext = { data, calculations };

  function updateContent(next: DocumentContent) {
    onContentChange?.(next);
  }

  const articleNumbers = visibleArticleNumbers(resolved.articles, data);

  return (
    <>
      {resolved.intro ? (
        <p className="contract-intro contract-intro--partner">
          <EditableDocumentText
            template={normalizeIntroProefperiodeTemplate(resolved.intro)}
            context={context}
            editable={editable}
            onTemplateChange={(intro) =>
              updateContent(patchContent(resolved, { intro }))
            }
          />
        </p>
      ) : null}

      {articleNumbers
        .filter((number) => number <= MAIN_CONTRACT_PAGE1_LAST_ARTICLE)
        .map((number) => {
          const article = resolved.articles[String(number)];
          if (!article) return null;
          return (
            <Article key={number} number={number}>
              {renderArticleBody(
                article.body,
                context,
                editable,
                (body) => updateContent(patchArticle(resolved, number, body)),
                article.title
              )}
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
  editable,
  onContentChange,
}: DocumentContentRendererProps) {
  const resolved = resolveContent(data, content);
  const context: DocumentRenderContext = { data, calculations };

  function updateContent(next: DocumentContent) {
    onContentChange?.(next);
  }

  const articleNumbers = visibleArticleNumbers(resolved.articles, data);

  return (
    <>
      {articleNumbers
        .filter((number) => number === MAIN_CONTRACT_PAGE1_LAST_ARTICLE + 1)
        .map((number) => {
          const article = resolved.articles[String(number)];
          if (!article) return null;
          return (
            <Article key={number} number={number}>
              {renderArticleBody(
                article.body,
                context,
                editable,
                (body) => updateContent(patchArticle(resolved, number, body)),
                article.title
              )}
            </Article>
          );
        })}

      {(resolved.continued ?? []).map((paragraph, index) => (
        <p key={`continued-${index}`} className="contract-article-continued">
          <EditableDocumentText
            template={paragraph}
            context={context}
            editable={editable}
            onTemplateChange={(nextParagraph) => {
              const continued = [...(resolved.continued ?? [])];
              continued[index] = nextParagraph;
              updateContent(patchContent(resolved, { continued }));
            }}
          />
        </p>
      ))}

      {articleNumbers
        .filter((number) => number > MAIN_CONTRACT_PAGE1_LAST_ARTICLE + 1)
        .map((number) => {
          const article = resolved.articles[String(number)];
          if (!article) return null;
          return (
            <Article key={number} number={number}>
              {renderArticleBody(
                article.body,
                context,
                editable,
                (body) => updateContent(patchArticle(resolved, number, body)),
                article.title
              )}
            </Article>
          );
        })}
    </>
  );
}
