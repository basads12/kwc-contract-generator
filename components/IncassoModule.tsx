"use client";

import { formatCurrency } from "@/lib/formatters";

interface IncassoModuleProps {
  contractId: string;
  contractNumber: string;
  maandbedrag: number;
  acknowledged: boolean;
  locked: boolean;
  onUpdate: () => void;
  onMessage: (message: string) => void;
}

export default function IncassoModule({
  contractId,
  contractNumber,
  maandbedrag,
  acknowledged,
  locked,
  onUpdate,
  onMessage,
}: IncassoModuleProps) {
  async function handleAcknowledge(checked: boolean) {
    const res = await fetch(`/api/contracts/${contractId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ incassoAcknowledged: checked }),
    });
    const data = await res.json();
    if (!res.ok) {
      onMessage(data.error ?? "Incasso bijwerken mislukt");
      return;
    }
    onMessage(
      checked
        ? "Incasso gemarkeerd als voorbereid"
        : "Incasso-akkoord ingetrokken"
    );
    onUpdate();
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-2 text-sm font-semibold text-zinc-800">
        SEPA-incasso (voorbereid)
      </h2>
      <p className="mb-3 text-sm text-zinc-600">
        Contractnummer: <strong>{contractNumber}</strong>
        <br />
        Maandbedrag: <strong>{formatCurrency(maandbedrag)}</strong> exclusief btw
      </p>
      <div className="rounded-md border border-dashed border-purple-300 bg-purple-50/50 p-3 text-sm text-zinc-700">
        <p className="mb-2 font-medium">Akkoordtekst SEPA-incasso</p>
        <p className="text-xs leading-relaxed">
          Door akkoord te gaan machtigt de klant Galerie de Kunst van Kunst om
          het maandbedrag van {formatCurrency(maandbedrag)} (excl. btw) maandelijks
          te incasseren via SEPA-automatische incasso. De incasso wordt uitgevoerd
          na koppeling met Mollie/iDEAL/Wero (nog niet actief).
        </p>
      </div>
      <label className="mt-3 flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={acknowledged}
          disabled={!locked}
          onChange={(e) => handleAcknowledge(e.target.checked)}
          className="mt-0.5"
        />
        <span>
          Klant heeft akkoord gegeven voor SEPA-incasso (handmatig vastgelegd)
        </span>
      </label>
      <p className="mt-2 text-xs text-zinc-500">
        Placeholder: Mollie/iDEAL/Wero-verificatie volgt in een latere fase.
        {!locked && " Beschikbaar na ondertekening."}
      </p>
    </section>
  );
}
