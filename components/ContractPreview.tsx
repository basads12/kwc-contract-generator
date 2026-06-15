"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ContractCalculations, ContractFormData } from "@/lib/types";
import { SIJABLOON_2_SLUG } from "@/lib/templateConstants";
import { resolveBaseTemplateSlug } from "@/lib/templateApply";
import ContractDocument from "./ContractDocument";
import ContractDocumentSjabloon2 from "./ContractDocumentSjabloon2";

const A4_WIDTH_PX = (210 * 96) / 25.4;

interface ContractPreviewProps {
  data: ContractFormData;
  calculations: ContractCalculations;
  signatureImageUrl?: string | null;
  signedByName?: string | null;
}

function getAvailableWidth(container: HTMLElement | null): number {
  const containerWidth = container?.clientWidth ?? 0;
  const viewportWidth =
    typeof window !== "undefined"
      ? (window.visualViewport?.width ?? window.innerWidth)
      : containerWidth;

  if (containerWidth > 0) {
    return containerWidth;
  }

  return viewportWidth;
}

function getScale(available: number): number {
  if (available <= 0) return 1;
  return Math.min(1, available / A4_WIDTH_PX);
}

function measureContentHeight(content: HTMLElement): number {
  const pages = content.querySelector(".contract-pages");
  if (pages instanceof HTMLElement) {
    return pages.scrollHeight;
  }
  return content.scrollHeight;
}

export default function ContractPreview({
  data,
  calculations,
  signatureImageUrl,
  signedByName,
}: ContractPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ scale: 1, height: 0 });

  const measure = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const available = getAvailableWidth(container);
    const scale = getScale(available);
    const height = measureContentHeight(content);

    setLayout({ scale, height });
    container.style.setProperty("--contract-view-scale", String(scale));
  }, []);

  useLayoutEffect(() => {
    measure();
    const frame = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(frame);
  }, [measure, data.templateSlug, data.bedrijfsnaam, calculations.jaarbedrag]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const observer = new ResizeObserver(() => {
      window.requestAnimationFrame(measure);
    });
    observer.observe(container);
    observer.observe(content);

    const pages = content.querySelector(".contract-pages");
    if (pages instanceof HTMLElement) {
      observer.observe(pages);
    }

    const viewport = window.visualViewport;
    const onViewportChange = () => window.requestAnimationFrame(measure);

    window.addEventListener("resize", onViewportChange);
    window.addEventListener("orientationchange", onViewportChange);
    viewport?.addEventListener("resize", onViewportChange);
    viewport?.addEventListener("scroll", onViewportChange);

    const delayedMeasure = window.setTimeout(measure, 250);

    return () => {
      observer.disconnect();
      window.clearTimeout(delayedMeasure);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("orientationchange", onViewportChange);
      viewport?.removeEventListener("resize", onViewportChange);
      viewport?.removeEventListener("scroll", onViewportChange);
    };
  }, [measure]);

  const baseSlug = resolveBaseTemplateSlug(
    data.templateSlug,
    data.baseTemplateSlug
  );
  const DocumentComponent =
    baseSlug === SIJABLOON_2_SLUG
      ? ContractDocumentSjabloon2
      : ContractDocument;

  const { scale, height } = layout;
  const isScaled = scale < 0.999;
  const scaledWidth = A4_WIDTH_PX * scale;
  const layoutSpacer = height > 0 ? height * (1 - scale) : 0;

  return (
    <div
      id="contract-print-area"
      className={`contract-preview${isScaled ? " contract-preview--scaled" : ""}`}
      ref={containerRef}
      style={{ "--contract-view-scale": scale } as CSSProperties}
    >
      <div
        className="contract-preview__viewport"
        style={
          isScaled
            ? {
                width: scaledWidth,
              }
            : undefined
        }
      >
        <div
          ref={contentRef}
          className={`contract-preview__content${
            isScaled ? " contract-preview__content--scaled" : ""
          }`}
          style={
            isScaled
              ? {
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  width: A4_WIDTH_PX,
                  marginBottom: layoutSpacer > 0 ? -layoutSpacer : undefined,
                }
              : undefined
          }
        >
          <DocumentComponent
            data={data}
            calculations={calculations}
            signatureImageUrl={signatureImageUrl}
            signedByName={signedByName}
          />
        </div>
      </div>
    </div>
  );
}
