import type { ContractFormData } from "@/lib/types";
import { formatAantalBestaandeKlanten, formatDateLong } from "@/lib/formatters";

interface AdresaanleveringDocumentProps {
  data: ContractFormData;
}

const COLUMN_HEADERS = [
  "Aanhef",
  "Naam",
  "Adres",
  "Huisnummer",
  "Postcode",
  "Woonplaats",
  "E-mail",
  "Telefoon/Mobiel",
] as const;

function ContactField({ label, value }: { label: string; value: string }) {
  return (
    <div className="adres-contact-row">
      <span className="adres-contact-row__label">{label}</span>
      <span className="adres-contact-row__line">
        {value.trim() ? value : "\u00a0"}
      </span>
    </div>
  );
}

export default function AdresaanleveringDocument({
  data,
}: AdresaanleveringDocumentProps) {
  const aantalAdressen = formatAantalBestaandeKlanten(
    data.aantalBestaandeKlanten
  );

  return (
    <section className="a4-page a4-page--bijlage3">
      <h1 className="contract-heading1">Bijlage 3</h1>
      <h2 className="contract-heading2">Adresaanlevering</h2>

      <p className="contract-paragraph">
        De logo&apos;s, huisstijlbestanden en overige benodigde
        marketingmaterialen dienen uiterlijk twee weken na ondertekening van deze
        overeenkomst te worden aangeleverd, derhalve uiterlijk op{" "}
        {formatDateLong(data.datumLogoAanlevering)}.
      </p>

      <p className="contract-paragraph">
        Na ontvangst van de benodigde logo- en huisstijlbestanden ontvangt{" "}
        {data.bedrijfsnaam} binnen 7 werkdagen een digitale proefdruk van het
        kaartje ter goedkeuring. Op deze proefdruk dient uiterlijk{" "}
        {formatDateLong(data.datumAkkoordProefdruk)} schriftelijk akkoord te
        worden gegeven.
      </p>

      <p className="contract-paragraph">
        De adresgegevens voor de overgangsfase ({aantalAdressen} adressen)
        dienen uiterlijk op {formatDateLong(data.datumAdresgegevens)} door ons te
        zijn ontvangen.
      </p>

      <p className="contract-paragraph">
        Adresbestanden dienen te worden aangeleverd in een Excel-bestand met
        onderstaande kolomindeling:
      </p>

      <table className="adres-columns-table">
        <colgroup>
          <col className="col-aanhef" />
          <col className="col-naam" />
          <col className="col-adres" />
          <col className="col-huisnummer" />
          <col className="col-postcode" />
          <col className="col-woonplaats" />
          <col className="col-email" />
          <col className="col-telefoon" />
        </colgroup>
        <thead>
          <tr>
            {COLUMN_HEADERS.map((header) => (
              <th
                key={header}
                className={
                  header === "Telefoon/Mobiel"
                    ? "adres-columns-table__phone"
                    : undefined
                }
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, index) => (
            <tr key={index}>
              {COLUMN_HEADERS.map((header) => (
                <td key={header}>&nbsp;</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <p className="contract-section-label">
        Verantwoordelijke aanlevering logo en huisstijl
      </p>
      <ContactField label="Naam" value={data.verantwoordelijkeLogoNaam} />
      <ContactField label="Telefoon" value={data.verantwoordelijkeLogoTelefoon} />
      <ContactField label="E-mail" value={data.verantwoordelijkeLogoEmail} />

      <p className="contract-section-label">Verantwoordelijke aanlevering adressen</p>
      <ContactField label="Naam" value={data.verantwoordelijkeAdressenNaam} />
      <ContactField
        label="Telefoon"
        value={data.verantwoordelijkeAdressenTelefoon}
      />
      <ContactField label="E-mail" value={data.verantwoordelijkeAdressenEmail} />
    </section>
  );
}
