"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ContractPreview from "@/components/ContractPreview";
import SignaturePad from "@/components/SignaturePad";
import { calculateContractValues } from "@/lib/calculations";
import { canSignContract } from "@/lib/contract-status";
import { parseFormDataWithDocument } from "@/lib/validation";
import type { ContractFormData } from "@/lib/types";
import type { ContractStatus } from "@prisma/client";

export default function TekenenPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [formData, setFormData] = useState<ContractFormData | null>(null);
  const [contractNumber, setContractNumber] = useState("");
  const [status, setStatus] = useState<ContractStatus | null>(null);
  const [locked, setLocked] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signature, setSignature] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractOpen, setContractOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/contracts/sign/${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        try {
          const fd = parseFormDataWithDocument(data.formData);
          setFormData(fd);
          setSignerName(fd.contactpersoon);
        } catch {
          setError("Contractgegevens konden niet worden geladen");
          return;
        }
        setContractNumber(data.contractNumber);
        setStatus(data.status);
        setLocked(data.locked);
      })
      .catch(() => setError("Laden mislukt"));
  }, [token]);

  const calculations = useMemo(
    () => (formData ? calculateContractValues(formData) : null),
    [formData]
  );

  const canSign =
    status !== null && canSignContract(status, locked);

  async function handleSign() {
    if (!signature || !signerName.trim() || !signerEmail.trim()) {
      setError("Vul naam, e-mail en handtekening in");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/contracts/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signatureDataUrl: signature,
          signerName: signerName.trim(),
          signerEmail: signerEmail.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Ondertekenen mislukt");
      router.push(`/download/${token}?signed=1`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Fout");
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !formData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!formData || !calculations) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <p className="text-zinc-500">Laden…</p>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
        <p className="text-lg font-medium">Dit contract is al ondertekend.</p>
        <a
          href={`/download/${token}`}
          className="rounded-md bg-zinc-800 px-4 py-2 text-white"
        >
          Bekijk contract
        </a>
      </div>
    );
  }

  if (!canSign) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-medium text-zinc-800">
          Dit contract is nog niet klaar voor ondertekening.
        </p>
        <p className="max-w-md text-sm text-zinc-600">
          Vraag Galerie de Kunst van Kunst om het contract eerst te markeren als
          &quot;klaar voor ondertekening&quot; voordat u kunt tekenen.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-4 py-4">
        <h1 className="text-lg font-semibold text-zinc-900">
          Ondertekenen — {contractNumber}
        </h1>
        <p className="text-sm text-zinc-600">{formData.bedrijfsnaam}</p>
      </header>

      <div className="mx-auto max-w-lg space-y-4 p-4">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            Naam ondertekenaar
          </label>
          <input
            type="text"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            className="mb-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            E-mailadres
          </label>
          <input
            type="email"
            value={signerEmail}
            onChange={(e) => setSignerEmail(e.target.value)}
            className="mb-3 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
          />
          <label className="mb-2 block text-sm font-medium text-zinc-700">
            Handtekening (vinger of stylus)
          </label>
          <SignaturePad onChange={setSignature} />
          <button
            type="button"
            onClick={handleSign}
            disabled={submitting}
            className="mt-4 w-full rounded-md bg-zinc-800 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {submitting ? "Bezig…" : "Ondertekenen en bevestigen"}
          </button>
        </section>
      </div>

      <details
        className="w-full border-t border-zinc-200 bg-zinc-200/70"
        onToggle={(event) =>
          setContractOpen((event.currentTarget as HTMLDetailsElement).open)
        }
      >
        <summary className="cursor-pointer bg-white px-4 py-3 text-sm font-medium text-zinc-700">
          Contract bekijken
        </summary>
        {contractOpen && (
          <ContractPreview data={formData} calculations={calculations} />
        )}
      </details>
    </div>
  );
}
