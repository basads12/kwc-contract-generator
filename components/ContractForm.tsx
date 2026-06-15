"use client";

import NumericInput from "@/components/NumericInput";
import BerekeningenFields from "@/components/BerekeningenPanel";
import type { ContractFormData } from "@/lib/types";
import {
  applyDatumOvereenkomstChange,
  applyIngangsdatumChange,
  deriveContractDates,
  syncNawDeadlineDates,
} from "@/lib/deriveDates";

interface ContractFormProps {
  data: ContractFormData;
  onChange: (data: ContractFormData) => void;
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="contract-form-section">
      <legend className="contract-form-section__title">{title}</legend>
      <div className="space-y-3">{children}</div>
    </fieldset>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-zinc-600">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition-colors focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200";

export default function ContractForm({ data, onChange }: ContractFormProps) {
  function update<K extends keyof ContractFormData>(
    key: K,
    value: ContractFormData[K]
  ) {
    const next = { ...data, [key]: value };
    if (key === "datumOvereenkomst") {
      onChange({
        ...next,
        ...applyDatumOvereenkomstChange(String(value)),
      });
      return;
    }
    if (key === "ingangsdatum") {
      onChange({
        ...next,
        ...applyIngangsdatumChange(next, String(value)),
      });
      return;
    }
    if (key === "deadlineNawLevering" || key === "datumAdresgegevens") {
      onChange({ ...next, ...syncNawDeadlineDates(String(value)) });
      return;
    }
    onChange(next);
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="text-sm">
      <FormSection title="Klantgegevens">
        <FormField label="Bedrijfsnaam">
          <input
            type="text"
            className={inputClass}
            value={data.bedrijfsnaam}
            onChange={(e) => update("bedrijfsnaam", e.target.value)}
          />
        </FormField>
        <FormField label="Aanhef">
          <select
            className={inputClass}
            value={data.aanhef}
            onChange={(e) => update("aanhef", e.target.value)}
          >
            <option value="dhr.">dhr.</option>
            <option value="mevr.">mevr.</option>
            <option value="mw.">mw.</option>
            <option value="">(geen)</option>
          </select>
        </FormField>
        <FormField label="Contactpersoon">
          <input
            type="text"
            className={inputClass}
            value={data.contactpersoon}
            onChange={(e) => update("contactpersoon", e.target.value)}
          />
        </FormField>
        <FormField label="Adres">
          <input
            type="text"
            className={inputClass}
            value={data.adres}
            onChange={(e) => update("adres", e.target.value)}
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Postcode">
            <input
              type="text"
              className={inputClass}
              value={data.postcode}
              onChange={(e) => update("postcode", e.target.value)}
            />
          </FormField>
          <FormField label="Plaats (adres)">
            <input
              type="text"
              className={inputClass}
              value={data.plaats}
              onChange={(e) => update("plaats", e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Plaats ondertekening">
          <input
            type="text"
            className={inputClass}
            value={data.plaatsOndertekening}
            onChange={(e) => update("plaatsOndertekening", e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Datum contract">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs leading-relaxed text-zinc-500">
            Wijzig je de datum overeenkomst, dan worden ingangsdatum (1e van de
            maand) en alle aanleverdatums automatisch herberekend. Daarna kun je
            alles nog handmatig aanpassen.
          </p>
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                ...deriveContractDates(
                  data.datumOvereenkomst,
                  data.ingangsdatum
                ),
              })
            }
            className="shrink-0 rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
          >
            Datums herberekenen
          </button>
        </div>
        <FormField label="Datum overeenkomst">
          <input
            type="date"
            className={inputClass}
            value={data.datumOvereenkomst}
            onChange={(e) => update("datumOvereenkomst", e.target.value)}
          />
        </FormField>
        <FormField label="Ingangsdatum">
          <input
            type="date"
            className={inputClass}
            value={data.ingangsdatum}
            onChange={(e) => update("ingangsdatum", e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Standaard: 1e van de maand na datum overeenkomst
          </p>
        </FormField>
        <FormField label="Looptijd overeenkomst (jaren)">
          <NumericInput
            className={inputClass}
            min={1}
            value={data.looptijdJaren}
            onChange={(value) => update("looptijdJaren", value)}
          />
        </FormField>
        <FormField label="Proefperiode (maanden)">
          <NumericInput
            className={inputClass}
            min={1}
            value={data.proefperiodeMaanden}
            onChange={(value) => update("proefperiodeMaanden", value)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Berekeningen">
        <BerekeningenFields
          data={data}
          onChange={onChange}
          inputClass={inputClass}
        />
      </FormSection>

      <FormSection title="KWC-voorwaarden">
        <FormField label="Bestedingsgrens klant (€)">
          <NumericInput
            className={inputClass}
            min={0}
            allowDecimals
            value={data.bestedingsgrens}
            onChange={(value) => update("bestedingsgrens", value)}
          />
        </FormField>
        <FormField label="Waarde KWC (€)">
          <NumericInput
            className={inputClass}
            min={0}
            allowDecimals
            value={data.waardeKwc}
            onChange={(value) => update("waardeKwc", value)}
          />
        </FormField>
        <FormField label="Geldigheidsduur KWC (maanden)">
          <NumericInput
            className={inputClass}
            min={1}
            value={data.geldigheidsduurKwcMaanden}
            onChange={(value) => update("geldigheidsduurKwcMaanden", value)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Bestaande klanten">
        <FormField label="Aantal bestaande klanten">
          <NumericInput
            className={inputClass}
            min={0}
            value={data.aantalBestaandeKlanten}
            onChange={(value) => update("aantalBestaandeKlanten", value)}
          />
        </FormField>
        <FormField label="Portokosten">
          <input
            type="text"
            className={inputClass}
            placeholder="bijv. € 2,50 per stuk"
            value={data.portokosten}
            onChange={(e) => update("portokosten", e.target.value)}
          />
        </FormField>
      </FormSection>

      <FormSection title="Ondertekening">
        <FormField label="Naam vertegenwoordiger galerie (1)">
          <input
            type="text"
            className={inputClass}
            value={data.naamVertegenwoordigerGalerie}
            onChange={(e) =>
              update("naamVertegenwoordigerGalerie", e.target.value)
            }
          />
        </FormField>
        <FormField label="Naam vertegenwoordiger galerie (2)">
          <input
            type="text"
            className={inputClass}
            value={data.naamTweedeVertegenwoordigerGalerie}
            onChange={(e) =>
              update("naamTweedeVertegenwoordigerGalerie", e.target.value)
            }
          />
        </FormField>
      </FormSection>

      <FormSection title="Adresaanlevering & deadlines">
        <p className="text-xs leading-relaxed text-zinc-500">
          Deadlines voor logo, proefdruk en adresgegevens (art. 4 en Bijlage 3).
          Wijzig je de datum overeenkomst, dan worden deze via &quot;Datums
          herberekenen&quot; automatisch bijgewerkt.
        </p>
        <FormField label="Uiterlijk logo/huisstijl">
          <input
            type="date"
            className={inputClass}
            value={data.datumLogoAanlevering}
            onChange={(e) => update("datumLogoAanlevering", e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Standaard: 2 weken na datum overeenkomst
          </p>
        </FormField>
        <FormField label="Uiterlijk akkoord proefdruk">
          <input
            type="date"
            className={inputClass}
            value={data.datumAkkoordProefdruk}
            onChange={(e) => update("datumAkkoordProefdruk", e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Standaard: 1 week na logo, vóór de adresdeadline
          </p>
        </FormField>
        <FormField label="Deadline NAW & adresgegevens (art. 4 / Bijlage 3)">
          <input
            type="date"
            className={inputClass}
            value={data.deadlineNawLevering}
            onChange={(e) => update("deadlineNawLevering", e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Standaard: vóór ingangsdatum — gelijk in art. 4 en Bijlage 3
          </p>
        </FormField>
        <FormField label="Deadline adresgegevens overgangsfase (Bijlage 3)">
          <input
            type="date"
            className={inputClass}
            value={data.datumAdresgegevens}
            onChange={(e) => update("datumAdresgegevens", e.target.value)}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Gelijk aan deadline NAW — wijziging synchroniseert beide velden
          </p>
        </FormField>
      </FormSection>

      <FormSection title="Verantwoordelijken (optioneel)">
        <p className="text-xs leading-relaxed text-zinc-500">
          Laat je een veld leeg, dan verschijnt op de print een leeg invulveld in
          Bijlage 3.
        </p>
        <FormField label="Verantwoordelijke logo — naam">
          <input
            type="text"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeLogoNaam}
            onChange={(e) =>
              update("verantwoordelijkeLogoNaam", e.target.value)
            }
          />
        </FormField>
        <FormField label="Verantwoordelijke logo — telefoon">
          <input
            type="text"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeLogoTelefoon}
            onChange={(e) =>
              update("verantwoordelijkeLogoTelefoon", e.target.value)
            }
          />
        </FormField>
        <FormField label="Verantwoordelijke logo — e-mail">
          <input
            type="email"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeLogoEmail}
            onChange={(e) =>
              update("verantwoordelijkeLogoEmail", e.target.value)
            }
          />
        </FormField>
        <FormField label="Verantwoordelijke adressen — naam">
          <input
            type="text"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeAdressenNaam}
            onChange={(e) =>
              update("verantwoordelijkeAdressenNaam", e.target.value)
            }
          />
        </FormField>
        <FormField label="Verantwoordelijke adressen — telefoon">
          <input
            type="text"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeAdressenTelefoon}
            onChange={(e) =>
              update("verantwoordelijkeAdressenTelefoon", e.target.value)
            }
          />
        </FormField>
        <FormField label="Verantwoordelijke adressen — e-mail">
          <input
            type="email"
            className={inputClass}
            placeholder="Optioneel — anders leeg invulveld op print"
            value={data.verantwoordelijkeAdressenEmail}
            onChange={(e) =>
              update("verantwoordelijkeAdressenEmail", e.target.value)
            }
          />
        </FormField>
      </FormSection>
    </form>
  );
}
