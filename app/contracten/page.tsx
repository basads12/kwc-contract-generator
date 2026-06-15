"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_ORDER,
  getStatusBadgeClass,
} from "@/lib/contract-status";
import type { ContractStatus } from "@prisma/client";

interface ContractListItem {
  id: string;
  contractNumber: string;
  status: ContractStatus;
  locked: boolean;
  formData: { bedrijfsnaam?: string; contactpersoon?: string };
  signedAt: string | null;
  updatedAt: string;
}

async function handleLogout() {
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = "/login";
}

export default function ContractenPage() {
  const [contracts, setContracts] = useState<ContractListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "">("");

  useEffect(() => {
    let cancelled = false;
    const url = statusFilter
      ? `/api/contracts?status=${statusFilter}`
      : "/api/contracts";

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else {
          setError(null);
          setContracts(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Laden mislukt");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  return (
    <div className="min-h-screen bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white px-4 py-4 lg:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-semibold text-zinc-900">Contracten</h1>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Nieuw contract
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4 lg:p-6">
        <div className="mb-4">
          <label className="text-sm text-zinc-600">
            Filter op status{" "}
            <select
              value={statusFilter}
              onChange={(e) => {
                setLoading(true);
                setStatusFilter(e.target.value as ContractStatus | "");
              }}
              className="ml-2 rounded-md border border-zinc-300 px-2 py-1 text-sm"
            >
              <option value="">Alle</option>
              {CONTRACT_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {CONTRACT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading && <p className="text-sm text-zinc-500">Laden…</p>}
        {error && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            {error}
            <p className="mt-2 text-xs text-amber-700">
              Stel DATABASE_URL in (Vercel Postgres / Neon) en voer{" "}
              <code>npx prisma migrate deploy</code> uit.
            </p>
          </div>
        )}
        {!loading && !error && contracts.length === 0 && (
          <p className="text-sm text-zinc-500">Geen contracten gevonden.</p>
        )}
        <ul className="space-y-2">
          {contracts.map((c) => (
            <li key={c.id}>
              <Link
                href={`/contracten/${c.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm transition hover:border-zinc-300"
              >
                <div>
                  <p className="font-medium text-zinc-900">{c.contractNumber}</p>
                  <p className="text-sm text-zinc-600">
                    {c.formData.bedrijfsnaam} — {c.formData.contactpersoon}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(c.status)}`}
                >
                  {CONTRACT_STATUS_LABELS[c.status]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
