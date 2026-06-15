"use client";

import { useEffect, useRef } from "react";
import {
  applyDocumentPlaceholders,
  type DocumentRenderContext,
} from "@/lib/renderDocumentText";

interface EditableDocumentTextProps {
  template: string;
  context: DocumentRenderContext;
  editable?: boolean;
  className?: string;
  onTemplateChange?: (next: string) => void;
}

export default function EditableDocumentText({
  template,
  context,
  editable = false,
  className,
  onTemplateChange,
}: EditableDocumentTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const display = applyDocumentPlaceholders(template, context);

  useEffect(() => {
    const element = ref.current;
    if (!element || document.activeElement === element) return;
    element.innerText = display;
  }, [display]);

  if (!editable) {
    return <span className={className}>{display}</span>;
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`contract-editable ${className ?? ""}`.trim()}
      onBlur={(event) =>
        onTemplateChange?.(event.currentTarget.innerText.trim())
      }
    />
  );
}
