import SignatureBlock from "../SignatureBlock";
import { DashItem, GALERIE_PARTY, Paragraph } from "./shared";
import type { ContractSignatureProps } from "./KlachtenprotocolBijlage";

export default function AvgBijlageSjabloon2({
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
    <section className="a4-page a4-page--flex a4-page--bijlage1 contract-print-bijlage contract-print-bijlage-start">
      <h1 className="contract-heading1">Bijlage 1</h1>
      <h2 className="contract-heading2">Verwerkersovereenkomst (AVG)</h2>
      <Paragraph>
        Overeenkomst inzake AVG tussen Galerie De Kunst van Kunst en{" "}
        {bedrijfsnaam}.
      </Paragraph>
      <Paragraph>
        Wij hechten evenveel waarde aan een zorgvuldige omgang met de gegevens
        van uw klanten als u. In het kader van de Algemene Verordening
        Gegevensbescherming (AVG) leggen partijen daarom hieronder, conform
        artikel 28 AVG, vast hoe wij deze gegevens voor u verwerken. U bent en
        blijft verwerkingsverantwoordelijke en {GALERIE_PARTY} is verwerker; wij
        verwerken de persoonsgegevens uitsluitend op uw gedocumenteerde
        instructie en uitsluitend voor de hieronder genoemde doeleinden. Mochten
        wij op grond van een wettelijke verplichting anders moeten handelen, dan
        informeren wij u daarover vooraf, tenzij die wet dit verbiedt.
      </Paragraph>

      <p className="contract-section-label">Wat wij voor u verwerken</p>
      <DashItem>
        Doel en aard: het namens u aanbieden en onder de aandacht brengen van de
        Kunst-waardecheque per e-mail, post en telefoon, inclusief het verzenden
        van herinneringen.
      </DashItem>
      <DashItem>
        Categorieën betrokkenen: uw klanten die voor een KWC in aanmerking
        komen.
      </DashItem>
      <DashItem>
        Soort persoonsgegevens: naam, adres, postcode, woonplaats, e-mailadres
        en telefoonnummer. Er worden geen bijzondere categorieën
        persoonsgegevens verwerkt.
      </DashItem>
      <DashItem>
        Bewaartermijn: gedurende de looptijd van de overeenkomst en maximaal 24
        maanden na datum van benadering.
      </DashItem>

      <p className="contract-section-label">
        Hoe wij dit voor u en uw klanten waarborgen
      </p>
      <DashItem>
        Wij hebben een geheimhoudingsplicht voor alle persoonsgegevens die wij
        van u verkrijgen. Uitsluitend onze eigen, daartoe geïnstrueerde
        medewerkers met een ondertekende geheimhoudingsverklaring hebben toegang
        tot uw gegevens.
      </DashItem>
      <DashItem>
        Wij treffen passende technische en organisatorische
        beveiligingsmaatregelen conform artikel 32 AVG, waaronder
        toegangsbeperking en beveiligde opslag van de gegevens.
      </DashItem>
      <DashItem>
        Wij verwerken de gegevens uitsluitend binnen de Europese Economische
        Ruimte (EER). Doorgifte naar een land buiten de EER vindt niet plaats
        zonder passende waarborgen op grond van de AVG.
      </DashItem>
      <DashItem>
        Wij schakelen geen sub-verwerker in zonder uw voorafgaande toestemming,
        leggen aan een eventuele sub-verwerker dezelfde verplichtingen op als in
        deze bijlage, en blijven jegens u volledig verantwoordelijk voor het
        handelen van die sub-verwerker.
      </DashItem>
      <DashItem>
        Bij een inbreuk in verband met persoonsgegevens (datalek) informeren wij
        u onverwijld en uiterlijk binnen 48 uur na ontdekking, met de informatie
        die u nodig heeft om aan uw meldplicht te voldoen.
      </DashItem>
      <DashItem>
        Wij verlenen u redelijke medewerking bij verzoeken van betrokkenen
        (zoals inzage, correctie, verwijdering of bezwaar) en bij uw
        verplichtingen op grond van de artikelen 32 tot en met 36 AVG, waaronder
        beveiliging, datalekken, een gegevensbeschermingseffectbeoordeling
        (DPIA) en een eventuele voorafgaande raadpleging.
      </DashItem>
      <DashItem>
        Wij stellen u op verzoek alle informatie ter beschikking die nodig is om
        de naleving van artikel 28 AVG aan te tonen, en werken mee aan een audit
        – ten hoogste eenmaal per jaar en op redelijke termijn aangekondigd –
        door u of een door u aangewezen onafhankelijke deskundige.
      </DashItem>
      <DashItem>
        Wij wijzen u er onmiddellijk op wanneer een instructie van u naar ons
        oordeel in strijd is met de AVG of andere privacywetgeving.
      </DashItem>
      <DashItem>
        Na afloop van de overeenkomst of eerder op uw verzoek verwijderen of
        retourneren wij, naar uw keuze, alle persoonsgegevens en bestaande
        kopieën, behoudens een eventuele wettelijke bewaarplicht.
      </DashItem>
      <Paragraph>
        Voor zover de galerie voor enig onderdeel toch als zelfstandig of
        gezamenlijk verwerkingsverantwoordelijke zou worden aangemerkt, gelden
        de toepasselijke verplichtingen uit de AVG dienovereenkomstig en maken
        partijen daarover zo nodig nadere afspraken op grond van artikel 26 AVG.
      </Paragraph>
      <Paragraph>
        Tevens neemt {bedrijfsnaam} in haar privacyverklaring op dat de
        persoonsgegevens van haar klanten mogen worden gebruikt voor
        aftersaledoeleinden, waaronder het verstrekken aan en het gebruik door{" "}
        {GALERIE_PARTY} ten behoeve van de Kunst-Waardecheque, en informeert
        haar klanten hierover.
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
