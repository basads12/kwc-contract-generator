"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ContractPreview from "@/components/ContractPreview";
import { calculateContractValues } from "@/lib/calculations";
import { printContractWithFilename } from "@/lib/contractPdfFilename";
import { parseFormDataWithDocument } from "@/lib/validation";
import type { ContractFormData } from "@/lib/types";

export default function VoorbeeldPage() {
  const params = useParams();
  const id = params.id as string;
  const [formData, setFormData] = useState<ContractFormData | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [signedByName, setSignedByName] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then((r) => r.json())
      .then((c) => {
        if (!c.error) {
          setFormData(parseFormDataWithDocument(c.formData));
          setSignatureUrl(c.signatureUrl);
          setSignedByName(c.signerName);
        }
      });
  }, [id]);

  const calculations = useMemo(
    () => (formData ? calculateContractValues(formData) : null),
    [formData]
  );

  if (!formData || !calculations) {
    return <p className="p-6 text-sm text-zinc-500">Laden…</p>;
  }

  return (
    <div>
      <div className="no-print border-b border-zinc-200 bg-white px-4 py-3">
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
          Print / PDF
        </button>
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
