"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  CONTRACT_STATUS_LABELS,
  getStatusBadgeClass,
} from "@/lib/contract-status";
import { getDownloadUrl, getSignUrl } from "@/lib/contracts";
import { buildContractPdfFilename } from "@/lib/contractPdfFilename";
import { formatCurrency } from "@/lib/formatters";
import type { ContractFormData } from "@/lib/types";
import type { ContractStatus } from "@prisma/client";
import IncassoModule from "@/components/IncassoModule";

interface ContractRecord {
  id: string;
  contractNumber: string;
  status: ContractStatus;
  locked: boolean;
  customerToken: string;
  formData: ContractFormData;
  signatureUrl: string | null;
  signerName: string | null;
  signerEmail: string | null;
  signedAt: string | null;
  signerIp: string | null;
  signerUserAgent: string | null;
  pdfUrl: string | null;
  incassoAcknowledged: boolean;
  emailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContractDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [contract, setContract] = useState<ContractRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`/api/contracts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setMessage(data.error);
        else setContract(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function copyLink(url: string) {
    await navigator.clipboard.writeText(url);
    setMessage("Link gekopieerd naar klembord");
  }

  async function sendEmail() {
    const res = await fetch(`/api/contracts/${id}/send-email`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      return;
    }
    setMessage(data.message);
    if (data.mailto) window.open(data.mailto, "_blank");
    load();
  }

  async function updateStatus(status: ContractStatus) {
    const res = await fetch(`/api/contracts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Status bijwerken mislukt");
      return;
    }
    setMessage("Status bijgewerkt");
    load();
  }

  async function deleteContract() {
    if (!confirm("Weet u zeker dat u dit concept wilt verwijderen?")) return;
    const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Verwijderen mislukt");
      return;
    }
    router.push("/contracten");
  }

  if (loading) return <p className="p-6 text-sm text-zinc-500">Laden…</p>;
  if (!contract) {
    return (
      <p className="p-6 text-sm text-red-600">{message ?? "Niet gevonden"}</p>
    );
  }

  const signUrl = getSignUrl(contract.customerToken);
  const downloadUrl = getDownloadUrl(contract.customerToken);
  const formData = contract.formData;
  const readyToSign =
    !contract.locked && contract.status === "KLAAR_VOOR_ONDERTEKENING";

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/contracten" className="text-sm text-zinc-500 hover:underline">
              ← Contracten
            </Link>
            <h1 className="text-lg font-semibold text-zinc-900">
              {contract.contractNumber}
            </h1>
            <p className="text-sm text-zinc-600">
              {formData.bedrijfsnaam} — {formData.contactpersoon}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(contract.status)}`}
          >
            {CONTRACT_STATUS_LABELS[contract.status]}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 p-4">
        {message && (
          <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-700">
            {message}
          </p>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-zinc-800">Acties</h2>
          <div className="flex flex-wrap gap-2">
            {!contract.locked && (
              <>
                <Link
                  href={`/contracten/${id}/bewerken`}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Bewerken
                </Link>
                <button
                  type="button"
                  onClick={deleteContract}
                  className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Verwijder concept
                </button>
              </>
            )}
            <Link
              href={`/contracten/${id}/voorbeeld`}
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
            >
              Voorbeeld / print
            </Link>
            {!contract.locked && contract.status !== "KLAAR_VOOR_ONDERTEKENING" && (
              <button
                type="button"
                onClick={() => updateStatus("KLAAR_VOOR_ONDERTEKENING")}
                className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                Markeer klaar voor ondertekening
              </button>
            )}
            {readyToSign && (
              <button
                type="button"
                onClick={() => copyLink(signUrl)}
                className="rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                Kopieer tekenlink (iPad)
              </button>
            )}
            {contract.locked && (
              <>
                <button
                  type="button"
                  onClick={() => copyLink(downloadUrl)}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
                >
                  Kopieer downloadlink
                </button>
                <button
                  type="button"
                  onClick={sendEmail}
                  className="rounded-md bg-zinc-800 px-3 py-2 text-sm text-white hover:bg-zinc-700"
                >
                  E-mail naar klant
                </button>
                {contract.pdfUrl && (
                  <a
                    href={contract.pdfUrl}
                    download={buildContractPdfFilename(
                      contract.formData.bedrijfsnaam,
                      contract.formData.datumOvereenkomst
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
                  >
                    Open PDF
                  </a>
                )}
                {contract.status === "INCASSO_VOORBEREID" && (
                  <button
                    type="button"
                    onClick={() => updateStatus("AFGEROND")}
                    className="rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900"
                  >
                    Markeer als afgerond
                  </button>
                )}
              </>
            )}
          </div>
          {readyToSign && (
            <p className="mt-3 break-all text-xs text-zinc-500">
              Tekenlink: {signUrl}
            </p>
          )}
        </section>

        {contract.locked && (
          <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-zinc-800">
              Ondertekening
            </h2>
            <dl className="grid gap-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <dt className="text-zinc-500">Naam</dt>
                <dd>{contract.signerName}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <dt className="text-zinc-500">E-mail</dt>
                <dd>{contract.signerEmail}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <dt className="text-zinc-500">Datum/tijd</dt>
                <dd>
                  {contract.signedAt
                    ? new Date(contract.signedAt).toLocaleString("nl-NL")
                    : "—"}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <dt className="text-zinc-500">IP-adres</dt>
                <dd className="break-all">{contract.signerIp}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <dt className="text-zinc-500">User-agent</dt>
                <dd className="break-all text-xs">{contract.signerUserAgent}</dd>
              </div>
            </dl>
            {contract.signatureUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={contract.signatureUrl}
                alt="Handtekening"
                className="mt-4 h-20 object-contain"
              />
            )}
          </section>
        )}

        <IncassoModule
          contractId={id}
          contractNumber={contract.contractNumber}
          maandbedrag={formData.maandbedrag}
          acknowledged={contract.incassoAcknowledged}
          locked={contract.locked}
          onUpdate={load}
          onMessage={setMessage}
        />

        <section className="rounded-lg border border-zinc-200 bg-white p-4 text-sm shadow-sm">
          <h2 className="mb-2 font-semibold text-zinc-800">Financieel</h2>
          <p>Maandbedrag: {formatCurrency(formData.maandbedrag)}</p>
          <p>Jaarbedrag: {formatCurrency(formData.jaarbedrag)}</p>
        </section>
      </main>
    </div>
  );
}
