import SignatureBlock from "../SignatureBlock";
import { DashItem, GALERIE_PARTY, Paragraph } from "./shared";

export interface ContractSignatureProps {
  galerieNaam: string;
  galerieTweedeNaam: string;
  bedrijfsnaam: string;
  contactpersoon: string;
  plaatsOndertekening: string;
  datumOvereenkomst: string;
  signatureImageUrl?: string | null;
  signedByName?: string | null;
}

export default function KlachtenprotocolBijlage({
  galerieNaam,
  galerieTweedeNaam,
  bedrijfsnaam,
  contactpersoon,
  plaatsOndertekening,
  datumOvereenkomst,
  signatureImageUrl,
  signedByName,
}: ContractSignatureProps) {
  return (
    <section className="a4-page a4-page--flex a4-page--bijlage2 contract-print-bijlage">
      <h1 className="contract-heading1">Bijlage 2</h1>
      <h2 className="contract-heading2">Protocol klachtenafhandeling</h2>
      <Paragraph>
        Er is sprake van een klacht wanneer een klant na het indienen van de
        klacht bij u niet akkoord gaat met de oplossing die wij uw klant
        bieden. De door ons gemaakte kosten voor de klacht zijn altijd voor
        onze rekening. Hieronder leest u hoe Galerie De Kunst van Kunst verder
        omgaat met eventuele klachten van een bezoeker.
      </Paragraph>

      <DashItem>
        U mailt een klacht direct door naar oplossing@dekunstvankunst.nl.
      </DashItem>
      <DashItem>
        Wij houden u binnen 2 werkdagen op de hoogte over de afhandeling van
        deze klacht. Normaal gesproken is de klacht uiterlijk binnen twee
        weken met de klant afgehandeld.
      </DashItem>
      <DashItem>
        De galerie geeft een reactie op de klacht, zodat dit u geen energie
        kost. Wanneer u deze reactie goedkeurt, verzendt u deze door naar uw
        klant. Door dit protocol te volgen heeft u er nauwelijks werk mee.
      </DashItem>
      <DashItem>
        De kosten voor de oplossingen die wij in de reactie aandragen, zijn
        voor onze rekening, bijvoorbeeld:
      </DashItem>
      <DashItem nested>
        Kilometervergoeding voor de klant à € 0,23 per km (retour privé –
        galerie).
      </DashItem>
      <DashItem nested>
        Een schilderij dat zij in opdracht mogen laten schilderen door één van
        onze kunstenaars, wanneer zij eventueel niet zijn geslaagd in onze
        galerie.
      </DashItem>
      <DashItem nested>
        Wij zorgen dat de klant uit uw naam een bos bloemen krijgt aangeboden
        voor de feedback. Uiteraard verzorgen wij dit met u als afzender, zodat
        ook hier geen energie door u in gestopt hoeft te worden. Daardoor zal
        de klant, zelfs als deze niet blij met de oplossing is, zich door u
        zeer serieus en gehoord voelen, zodat het positieve gevoel van uw
        klanten naar u als bedrijf gewaarborgd blijft.
      </DashItem>
      <DashItem>
        Klachten zijn niet terecht indien zij zich richten tegen de huisregels
        die wij duidelijk kenbaar hebben gemaakt, bijvoorbeeld op de
        Kunst-waardecheque, de uitnodiging via brief/mail of bij het inplannen
        van een afspraak op onze website, waarbij wij de huisregels nogmaals
        bevestigen. Voorbeelden zijn:
      </DashItem>
      <DashItem nested>Maximaal 2 personen per KWC.</DashItem>
      <DashItem nested>Dieren hebben geen toegang (m.u.v. geleidehond).</DashItem>
      <DashItem nested>Kinderen vanaf 12 jaar toegang.</DashItem>
      <DashItem nested>Niet filmen of fotograferen.</DashItem>
      <DashItem>
        Indien er sprake is van meer dan 1 klacht per maand, dan crediteren wij
        de maandfactuur.
      </DashItem>
      <DashItem>Stappen bij een eventuele klacht:</DashItem>
      <DashItem nested>
        U geeft de klacht door via oplossing@dekunstvankunst.nl.
      </DashItem>
      <DashItem nested>U ontvangt eerst een conceptbrief van ons.</DashItem>
      <DashItem nested>Na uw goedkeuring stuurt u deze door naar de klant.</DashItem>
      <DashItem nested>Binnen 2 weken is de klacht met de klant behandeld.</DashItem>
      <DashItem nested>Wij zorgen dat een attentie naar de klant gaat.</DashItem>
      <DashItem>De opbouw van de brief is als volgt:</DashItem>
      <DashItem nested>
        U bedankt voor de feedback en betreurt dat de klant dit zo heeft
        ervaren, temeer daar u veel positieve reacties over deze actie krijgt.
      </DashItem>
      <DashItem nested>Vervolgens een inhoudelijke reactie van de galerie.</DashItem>
      <DashItem nested>
        Dan de oplossing die de galerie aanbiedt (bijvoorbeeld schilderij in
        opdracht of kilometervergoeding).
      </DashItem>
      <DashItem nested>
        Ten slotte dankt u nogmaals voor de feedback en zegt u een leuke
        attentie toe.
      </DashItem>

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
