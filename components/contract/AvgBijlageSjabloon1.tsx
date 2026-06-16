import SignatureBlock from "../SignatureBlock";
import { GALERIE_PARTY, Paragraph } from "./shared";
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
    <section className="a4-page a4-page--flex a4-page--bijlage1 a4-page--avg-bijlage">
      <div className="avg-bijlage__header">
        <p className="avg-bijlage__label">Bijlage 1</p>

        <p className="avg-bijlage__title">
          Overeenkomst inzake AVG {bedrijfsnaam}
        </p>

        <p className="avg-bijlage__intro">
          In het kader van de Algemene Verordening Gegevensbescherming verklaren
          wij hierbij:
        </p>
      </div>

      <div className="avg-bijlage__body">
        <Paragraph>
          Wij verwerken de door u verstrekte gegevens uitsluitend voor het
          namens u aanbieden van de kunst-waardecheque door middel van e-mail,
          post of telefoon.
        </Paragraph>
        <Paragraph>
          Wij bewaren de gegevens maximaal 24 maanden na datum benadering.
        </Paragraph>
        <Paragraph>
          Wij hebben een geheimhoudingsplicht voor alle persoonsgegevens die wij
          van u verkrijgen.
        </Paragraph>
        <Paragraph>
          Uitsluitend de eigen medewerkers van {GALERIE_PARTY} hebben toegang
          tot uw gegevens.
        </Paragraph>
        <Paragraph>
          Al onze medewerkers hebben een geheimhoudingsverklaring ondertekend en
          zijn geïnstrueerd over de omgang met persoonsgegevens.
        </Paragraph>
        <Paragraph>
          Wij hebben afdoende maatregelen getroffen voor beveiliging van de
          persoonsgegevens, zowel organisatorisch als technisch.
        </Paragraph>
        <Paragraph>
          Wij hebben de plicht om u onverwijld te informeren als er een risico
          ontstaat ten aanzien van persoonsgegevens (bijvoorbeeld een datalek).
        </Paragraph>
        <Paragraph>
          Tevens neemt {bedrijfsnaam} in haar Privacy Voorwaarden op dat de
          gegevens van de klanten voor aftersale doeleinden gebruikt mogen
          worden.
        </Paragraph>
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
