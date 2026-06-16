"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ContractPreview from "@/components/ContractPreview";
import { calculateContractValues } from "@/lib/calculations";
import { blobToBase64, generateContractPdfBlob } from "@/lib/generateContractPdf";
import {
  buildContractPdfFilename,
  printContractWithFilename,
} from "@/lib/contractPdfFilename";
import { parseFormDataWithDocument } from "@/lib/validation";
import type { ContractFormData } from "@/lib/types";

export default function DownloadContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const token = params.token as string;
  const justSigned = searchParams.get("signed") === "1";
  const printAreaRef = useRef<HTMLDivElement>(null);
  const pdfAttempted = useRef(false);

  const [formData, setFormData] = useState<ContractFormData | null>(null);
  const [contractNumber, setContractNumber] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [signedByName, setSignedByName] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/contracts/by-token/${token}`)
      .then((r) => r.json())
      .then((full) => {
        if (full.error) {
          setError(full.error);
          return;
        }
        try {
          setFormData(parseFormDataWithDocument(full.formData));
        } catch {
          setError("Contractgegevens konden niet worden geladen");
          return;
        }
        setContractNumber(full.contractNumber);
        setPdfUrl(full.pdfUrl);
        setSignatureUrl(full.signatureUrl);
        setSignedByName(full.signerName);
        setLocked(full.locked);
      })
      .catch(() => setError("Laden mislukt"));
  }, [token]);

  const calculations = useMemo(
    () => (formData ? calculateContractValues(formData) : null),
    [formData]
  );

  useEffect(() => {
    if (
      !justSigned ||
      !formData ||
      !calculations ||
      pdfUrl ||
      pdfAttempted.current
    ) {
      return;
    }

    pdfAttempted.current = true;

    async function uploadPdf() {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const root = printAreaRef.current?.querySelector("#contract-print-area");
      if (!root) {
        setPdfStatus("PDF genereren mislukt — gebruik print.");
        return;
      }

      try {
        setPdfStatus("Definitieve PDF wordt gegenereerd…");
        const blob = await generateContractPdfBlob(root as HTMLElement);
        const pdfBase64 = await blobToBase64(blob);
        const res = await fetch(`/api/contracts/by-token/${token}/pdf`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pdfBase64 }),
        });
        const data = await res.json();
        if (res.ok && data.pdfUrl) {
          setPdfUrl(data.pdfUrl);
          setPdfStatus("Definitieve PDF opgeslagen.");
        } else {
          setPdfStatus(
            data.error ?? "PDF opslaan mislukt — gebruik print als alternatief."
          );
        }
      } catch {
        setPdfStatus("PDF genereren mislukt — gebruik print als alternatief.");
      }
    }

    uploadPdf();
  }, [justSigned, formData, calculations, pdfUrl, token]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!formData || !calculations) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Laden…</p>
      </div>
    );
  }

  if (!locked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p>Dit contract is nog niet ondertekend.</p>
        <a href={`/tekenen/${token}`} className="text-blue-600 underline">
          Ga naar ondertekenen
        </a>
      </div>
    );
  }

  const pdfFileName = buildContractPdfFilename(
    formData.bedrijfsnaam,
    formData.datumOvereenkomst
  );

  return (
    <div ref={printAreaRef}>
      <div className="no-print border-b border-zinc-200 bg-white px-4 py-4">
        {justSigned && (
          <p className="mb-2 text-sm font-medium text-green-700">
            Contract succesvol ondertekend.
          </p>
        )}
        {pdfStatus && (
          <p className="mb-2 text-sm text-zinc-600">{pdfStatus}</p>
        )}
        <h1 className="text-lg font-semibold">{contractNumber}</h1>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              printContractWithFilename(
                formData.bedrijfsnaam,
                formData.datumOvereenkomst
              )
            }
            className="rounded-md bg-zinc-800 px-4 py-2 text-sm text-white"
          >
            Opslaan als PDF (print)
          </button>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download={pdfFileName}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm"
            >
              Download PDF
            </a>
          )}
        </div>
      </div>
      <ContractPreview
        data={formData}
        calculations={calculations}
        signatureImageUrl={signatureUrl}
        signedByName={signedByName}
      />
    </div>
  );
}
