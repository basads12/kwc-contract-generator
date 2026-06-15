import { formatGeldigheidsduur } from "@/lib/formatters";
import SignatureBlock from "../SignatureBlock";
import type { ContractSignatureProps } from "./KlachtenprotocolBijlage";
import { GALERIE_PARTY } from "./shared";

interface ProefperiodeBijlageProps extends ContractSignatureProps {
  ingangsdatum: string;
  proefperiodeMaanden: number;
}

export default function ProefperiodeBijlage({
  ingangsdatum,
  proefperiodeMaanden,
  galerieNaam,
  galerieTweedeNaam,
  bedrijfsnaam,
  contactpersoon,
  plaatsOndertekening,
  datumOvereenkomst,
  signatureImageUrl,
  signedByName,
}: ProefperiodeBijlageProps) {
  return (
    <section className="a4-page a4-page--flex a4-page--bijlage4">
      <h1 className="contract-heading1">Bijlage 4</h1>
      <h2 className="contract-heading2">Artikel 3 Proefperiode</h2>

      <div className="contract-bijlage-clause">
        <span className="contract-bijlage-clause__number">3.1.</span>
        <p className="contract-bijlage-clause__body">
          Vanaf {ingangsdatum} geldt een proefperiode van{" "}
          {formatGeldigheidsduur(proefperiodeMaanden)}. Gedurende deze
          proefperiode kan de overeenkomst door beide partijen schriftelijk
          worden opgezegd. Opzegging is in ieder geval gerechtvaardigd indien
          het aantal gegronde klachten in de proefperiode meer dan 1% bedraagt
          van het aantal in die periode benaderde klanten. Onder een klacht
          wordt hierbij uitsluitend verstaan een klacht in de zin van het
          protocol klachtenafhandeling (Bijlage 2): van een klacht is pas sprake
          wanneer de klant na afhandeling niet akkoord gaat met de door de
          galerie aangeboden oplossing.
        </p>
      </div>

      <SignatureBlock
        galerieParty={GALERIE_PARTY}
        galerieNaam={galerieNaam}
        galerieTweedeNaam={galerieTweedeNaam}
        bedrijfsnaam={bedrijfsnaam}
        contactpersoon={contactpersoon}
        plaatsOndertekening={plaatsOndertekening}
        datum={datumOvereenkomst}
        variant="bijlage"
        signatureImageUrl={signatureImageUrl}
        signedByName={signedByName}
      />
    </section>
  );
}
