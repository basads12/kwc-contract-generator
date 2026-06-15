import SignatureBlock from "../SignatureBlock";
import { DashItem, GALERIE_PARTY, Paragraph } from "./shared";
import type { ContractSignatureProps } from "./KlachtenprotocolBijlage";

export default function AvgBijlageSjabloon1({
  bedrijfsnaam,
  galerieNaam,
  galerieTweedeNaam,
  contactpersoon,
  plaatsOndertekening,
  datumOvereenkomst,
  signatureImageUrl,
  signedByName,
}: ContractSignatureProps) {
  return (
    <section className="a4-page a4-page--flex a4-page--bijlage1">
      <h1 className="contract-heading1">Bijlage 1</h1>
      <h2 className="contract-heading2">Overeenkomst inzake AVG</h2>
      <Paragraph>
        Overeenkomst inzake AVG tussen Galerie De Kunst van Kunst en{" "}
        {bedrijfsnaam}.
      </Paragraph>
      <Paragraph>
        In het kader van de Algemene Verordening Gegevensbescherming verklaren
        wij hierbij:
      </Paragraph>
      <DashItem>
        Wij verwerken de door u verstrekte gegevens uitsluitend voor het namens
        u aanbieden van de Kunst-waardecheque door middel van e-mail, post of
        telefoon.
      </DashItem>
      <DashItem>
        Wij bewaren de gegevens maximaal 24 maanden na datum benadering.
      </DashItem>
      <DashItem>
        Wij hebben een geheimhoudingsplicht voor alle persoonsgegevens die wij
        van u verkrijgen.
      </DashItem>
      <DashItem>
        Uitsluitend de eigen medewerkers van {GALERIE_PARTY} hebben toegang tot
        uw gegevens. Al onze medewerkers hebben een geheimhoudingsverklaring
        ondertekend en zijn geïnstrueerd over de omgang met persoonsgegevens.
      </DashItem>
      <DashItem>
        Wij hebben afdoende maatregelen getroffen voor beveiliging van de
        persoonsgegevens, zowel organisatorisch als technisch.
      </DashItem>
      <DashItem>
        Wij hebben de plicht om u onverwijld te informeren als er een risico
        ontstaat ten aanzien van persoonsgegevens (bijvoorbeeld een datalek).
      </DashItem>
      <Paragraph>
        Tevens neemt {bedrijfsnaam} in haar privacyvoorwaarden op dat de
        gegevens van de klanten voor aftersaledoeleinden gebruikt kunnen worden.
      </Paragraph>

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
