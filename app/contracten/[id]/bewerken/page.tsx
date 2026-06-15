"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContractGenerator from "@/components/ContractGenerator";
import { parseFormDataWithDocument } from "@/lib/validation";
import type { ContractFormData } from "@/lib/types";

export default function BewerkenPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{
    formData: ContractFormData;
    contractNumber: string;
    locked: boolean;
    templateId?: string | null;
  } | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/${id}`)
      .then((r) => r.json())
      .then((c) => {
        if (c.error) {
          setLoadError(true);
          return;
        }
        try {
          setData({
            formData: parseFormDataWithDocument(c.formData),
            contractNumber: c.contractNumber,
            locked: c.locked,
            templateId: c.templateId,
          });
        } catch {
          setLoadError(true);
        }
      });
  }, [id]);

  if (loadError) {
    return (
      <p className="p-6 text-sm text-red-600">
        Contractgegevens konden niet worden geladen.
      </p>
    );
  }

  if (!data) return <p className="p-6 text-sm text-zinc-500">Laden…</p>;
  if (data.locked) {
    return (
      <p className="p-6 text-sm text-red-600">
        Dit contract is vergrendeld en kan niet meer worden bewerkt.
      </p>
    );
  }

  return (
    <ContractGenerator
      initialData={data.formData}
      contractId={id}
      contractNumber={data.contractNumber}
      initialTemplateId={data.templateId ?? undefined}
    />
  );
}
