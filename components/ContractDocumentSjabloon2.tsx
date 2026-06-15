import type { ContractCalculations, ContractFormData } from "@/lib/types";
import {
  formatAantalBestaandeKlanten,
  formatBetaaltermijn,
  formatDateLong,
  formatDateDayMonth,
  formatDateShort,
  formatGeldigheidsduur,
  formatLooptijd,
  formatPortokosten,
} from "@/lib/formatters";
import AdresaanleveringDocument from "./AdresaanleveringDocument";
import AvgBijlageSjabloon2 from "./contract/AvgBijlageSjabloon2";
import ContractLetterhead from "./contract/ContractLetterhead";
import KlachtenprotocolBijlage from "./contract/KlachtenprotocolBijlage";
import SignatureBlock from "./SignatureBlock";
import {
  Article,
  Currency,
  CurrencyArt7Monthly,
  CurrencyDecimal,
  GALERIE_PARTY,
  MainContractPageHeader,
  Paragraph,
} from "./contract/shared";

const MAIN_PAGES = 3;

interface ContractDocumentSjabloon2Props {
  data: ContractFormData;
  calculations: ContractCalculations;
  signatureImageUrl?: string | null;
  signedByName?: string | null;
}

export default function ContractDocumentSjabloon2({
  data,
  calculations,
  signatureImageUrl,
  signedByName,
}: ContractDocumentSjabloon2Props) {
  const ingangsdatum = formatDateShort(data.ingangsdatum);
  const datumOvereenkomst = formatDateLong(data.datumOvereenkomst);
  const portokostenTekst = formatPortokosten(data.portokosten);
  const aantalKlanten = formatAantalBestaandeKlanten(
    data.aantalBestaandeKlanten
  );
  const galerieNaam = data.naamVertegenwoordigerGalerie;
  const signatureProps = {
    galerieNaam,
    galerieTweedeNaam: data.naamTweedeVertegenwoordigerGalerie,
    bedrijfsnaam: data.bedrijfsnaam,
    contactpersoon: data.contactpersoon,
    plaatsOndertekening: data.plaatsOndertekening,
    datumOvereenkomst,
    signatureImageUrl,
    signedByName,
  };

  return (
    <div className="contract-pages">
      <section className="a4-page">
        <ContractLetterhead data={data} datumOvereenkomst={datumOvereenkomst} />
        <MainContractPageHeader page={1} total={MAIN_PAGES} />
        <p className="contract-subtitle">Samenwerkingsovereenkomst partnerbedrijf</p>

        <p className="contract-intro">
          Hierbij treft u onze overeenkomst aan inzake het concept
          Kunst-Waardecheques (hierna te noemen &ldquo;KWC&rdquo;). Wij hebben
          deze overeenkomst bewust helder en evenwichtig opgesteld. De actie
          wordt voor u kosteloos en zonder risico uitgevoerd: de organisatie, de
          kosten en de afhandeling van eventuele klachten nemen wij volledig voor
          onze rekening, en gedurende de proefperiode kunt u eenvoudig en zonder
          kosten terug. Onderstaande afspraken leggen vast hoe wij dit
          zorgvuldig en met respect voor uw klanten en hun gegevens voor u
          verzorgen.
        </p>

        <Article number={1}>
          U verstrekt aan iedere klant met een besteding boven de{" "}
          <Currency amount={data.bestedingsgrens} /> een KWC ter waarde van{" "}
          <Currency amount={data.waardeKwc} />. Deze KWC kan worden ingewisseld bij
          Galerie De Kunst van Kunst.
        </Article>

        <Article number={2}>
          Het is ons uitdrukkelijk verboden de door u verstrekte gegevens te
          gebruiken voor andere doeleinden dan de KWC. U blijft
          verwerkingsverantwoordelijke; wij verwerken de gegevens uitsluitend in
          uw opdracht en uitsluitend voor de KWC, en houden ons aan alle
          verplichtingen voortvloeiend uit de AVG (zie Bijlage 1, die tevens als
          verwerkersovereenkomst geldt). De geldigheidsduur van de KWC is{" "}
          {formatGeldigheidsduur(data.geldigheidsduurKwcMaanden)}. Wij zullen de
          klanten namens u tijdig herinneren per telefoon, e-mail of post en,
          indien gewenst, de geldigheidsduur verlengen.
        </Article>

        <Article number={3}>
          Op vertoon van de KWC kan men een schilderij uitzoeken ter waarde van
          maximaal <Currency amount={data.waardeKwc} /> inclusief btw. Bij een lager
          bedrag bestaat geen recht op uitbetaling van het verschil. Indien men
          een duurder schilderij wenst aan te schaffen, ontvangt men namens uw
          bedrijf 25% tot 50% korting op de eventuele bijbetaling, zonder dat
          hier voor u kosten aan verbonden zijn. De KWC is niet geldig voor
          lijsten, lakken, bezorging of andere aanvullende diensten; indien
          klanten hiervan gebruikmaken, worden deze kosten rechtstreeks bij hen
          in rekening gebracht. De KWC is overdraagbaar. Indien klanten geen
          geschikt schilderij vinden en de KWC niet willen overdragen, kunnen zij
          in opdracht een schilderij laten maken op onze kosten of ontvangen zij
          een passende attentie.
        </Article>

        <Article number={4}>
          Wij verzorgen voor uw bestaande klanten van de afgelopen drie jaar{" "}
          {aantalKlanten} stuks geheel kosteloos een gratis KWC ter waarde van{" "}
          <Currency amount={data.waardeKwc} />. Hiervoor betaalt u uitsluitend de
          portokosten{portokostenTekst}, Galerie De Kunst van Kunst bepaalt zelf
          het verstuurmoment van deze adressen. Alle adressen worden door ons
          vooraf ontdubbeld. U verstrekt ons voor{" "}
          {formatDateDayMonth(data.deadlineNawLevering)}
          {"\u00a0"}daartoe alle NAW-gegevens, inclusief telefoonnummer en
          e-mailadres, waarna wij deze klanten per post en e-mail informeren met
          een ambassadeursbrief, brochure en KWC. Deze adressen ontvangen wij
          graag binnen twee weken na ondertekening, in het Excel-bestand dat wij
          u per e-mail toesturen. Van de brochure, ambassadeursbrief en KWC heeft
          u reeds een concept ontvangen. U ontvangt deze ook digitaal, zodat
          eventuele gewenste aanpassingen kunnen worden doorgevoerd. Een
          belangrijk onderdeel van het concept is dat op zowel de brief als de
          brochure vier logo&apos;s in full colour worden geplaatst, met de
          vermelding dat deze actie mede mogelijk wordt gemaakt door de
          betrokken bedrijven. Dit verhoogt de waardebeleving en
          geloofwaardigheid voor de consument. De door ons aangedragen bedrijven
          kunnen in onderling overleg worden vervangen door de door u
          aangeleverde bedrijven.
        </Article>

        <Article number={5}>
          Vanaf {ingangsdatum} overhandigt u na de verkoop uw klanten
          persoonlijk een aankondigingskaartje (van ons voor u). Dit kaartje
          kunt u ook fysiek en/of digitaal meesturen bij de factuur of als
          gedrukt exemplaar worden toegevoegd bij aflevering. Hierop staat
          vermeld dat de klant op korte termijn een verrassing van u zal
          ontvangen. U voert de NAW-gegevens, inclusief telefoon en e-mail, in
          van klanten die recht hebben op een KWC. Wij leveren u hiervoor een
          Excel-bestand aan dat u volledig ingevuld aan ons terugstuurt. U dient
          deze adressen tweewekelijks aan te leveren. Na ongeveer twee weken
          ontvangen uw klanten de brochure, ambassadeursbrief en KWC waarin het
          geschenk nader wordt toegelicht. Conform de AVG kan men zich via deze
          mail desgewenst uitschrijven. U staat ervoor in dat u de adresgegevens
          rechtmatig en met een geldige AVG-grondslag aanlevert en dat uw
          klanten over deze aftersaleverwerking zijn geïnformeerd.
        </Article>

        <Article number={6}>
          De overeenkomst loopt vanaf {ingangsdatum} voor de duur van{" "}
          {formatLooptijd(data.looptijdJaren)}. Na afloop van deze termijn wordt
          de overeenkomst telkens stilzwijgend voortgezet onder dezelfde
          condities, met toepassing van CPI-indexering, tenzij een van beide
          partijen schriftelijk opzegt tegen het einde van een kalendermaand met
          inachtneming van een opzegtermijn van twaalf maanden.
        </Article>
      </section>

      <section className="a4-page a4-page--flex">
        <MainContractPageHeader page={2} total={MAIN_PAGES} />

        <Article number={7}>
          U levert in het eerste contractjaar, ingaande per {ingangsdatum},
          jaarlijks {data.aantalAdressenPerJaar} adressen per jaar tegen een
          tarief van <CurrencyDecimal amount={data.tariefPerAdres} /> per adres (
          <Currency amount={calculations.jaarbedrag} /> per jaar). Dit bedrag wordt
          in twaalf gelijke maandelijkse termijnen van{" "}
          <CurrencyArt7Monthly amount={calculations.maandbedrag} />.
        </Article>

        <p className="contract-article-continued">
          Het uitgangspunt binnen de samenwerking is een stabiele aanlevering van{" "}
          {data.aantalAdressenPerJaar} adressen per jaar, conform dit artikel. Om
          flexibiliteit te bieden bij onvoorziene omstandigheden hanteren wij een
          bandbreedte van 70% tot 130% ({calculations.ondergrens} en{" "}
          {calculations.bovengrens} adressen per jaar) zonder directe
          verrekening. Indien de aanlevering buiten deze bandbreedte valt, wordt
          dit op evenwichtige wijze gecorrigeerd: boven {calculations.bovengrens}{" "}
          adressen geldt een korting van 30% over het meerdere en onder de{" "}
          {calculations.ondergrens} adressen een toeslag van 30% over het
          tekort.
        </p>

        <Article number={8}>
          U heeft gedurende de overeenkomst recht op een budget aan kunst uit
          onze galerie ter hoogte van{" "}
          <Currency amount={calculations.kunstbudget} /> inclusief btw (gelijk aan
          het door u in het eerste jaar betaalde bedrag, zie artikel 7). Dit
          tegen commerciële prijzen in overeenstemming met de prijslijst van de
          galerie. Lijsten zijn hierbij niet inbegrepen.
        </Article>

        <Article number={9}>
          Wij factureren u vanaf {ingangsdatum} maandelijks{" "}
          <Currency amount={calculations.maandbedrag} /> exclusief btw. De in de
          artikelen 7 en 9 genoemde tarieven zijn exclusief btw; de cheque- en
          kunstwaarden in de artikelen 3 en 8 gelden inclusief btw. Betaling
          dient te geschieden binnen{" "}
          {formatBetaaltermijn(data.betaaltermijnDagen)} na factuurdatum. Bij
          niet-tijdige betaling bent u, zonder dat ingebrekestelling is vereist,
          de wettelijke handelsrente (artikel 6:119a BW) en de redelijke
          buitengerechtelijke incassokosten verschuldigd, en zijn wij gerechtigd
          onze werkzaamheden en verzendingen op te schorten totdat volledige
          betaling heeft plaatsgevonden.
        </Article>

        <Article number={10}>
          De KWC wordt uitsluitend ingezet als aftersalesgeschenk en mag niet
          worden gebruikt als verkoopargument of in reclame-uitingen.
        </Article>

        <Article number={11}>
          Essentieel voor het concept is de waardebeleving van de schilderijen.
          Partijen verplichten zich tot geheimhouding van de inhoud van deze
          overeenkomst en van alle in dit kader uitgewisselde gegevens, prijzen
          en afspraken. Deze geheimhoudingsverplichting blijft ook na beëindiging
          van de overeenkomst van kracht.
        </Article>

        <Article number={12}>
          Eventuele klachten van bezoekers worden altijd in overeenstemming met
          het protocol klachtenafhandeling (zie Bijlage 2) afgehandeld.
        </Article>

        <Article number={13}>
          Bij niet-nakoming van deze overeenkomst is de overtredende partij een
          boete verschuldigd van <Currency amount={1000} /> per gebeurtenis,
          onverminderd het recht op volledige schadevergoeding. Met name de
          punten 1, 2, 10, 11 en 12 zijn hierbij essentieel.
        </Article>

        <Article number={14}>
          Het BP-arrangement wordt kosteloos aangeboden. De samenstelling kan
          door Galerie De Kunst van Kunst worden aangepast of aangevuld, mits de
          minimale commerciële waarde van <Currency amount={25} /> behouden blijft.
        </Article>

        <Article number={15}>
          Vanaf {ingangsdatum} geldt een proefperiode van{" "}
          {formatGeldigheidsduur(data.proefperiodeMaanden)}. Gedurende deze
          proefperiode kan de overeenkomst door beide partijen schriftelijk
          worden opgezegd; hiervoor is geen reden vereist en is geen vergoeding
          verschuldigd. Opzegging is in ieder geval gerechtvaardigd indien het
          aantal gegronde klachten in de proefperiode meer dan 1% bedraagt van
          het aantal in die periode benaderde klanten. Onder een klacht wordt
          hierbij uitsluitend verstaan een klacht in de zin van het protocol
          klachtenafhandeling (Bijlage 2): van een klacht is pas sprake wanneer
          de klant na afhandeling niet akkoord gaat met de door de galerie
          aangeboden oplossing.
        </Article>
      </section>

      <section className="a4-page a4-page--flex">
        <MainContractPageHeader page={3} total={MAIN_PAGES} />

        <Article number={16}>
          Onze aansprakelijkheid is beperkt tot directe schade en tot maximaal
          het bedrag dat u in het betreffende contractjaar aan ons heeft betaald.
          Aansprakelijkheid voor indirecte schade, waaronder gevolgschade,
          bedrijfsschade en gederfde winst, is uitgesloten. Deze beperkingen
          gelden niet in geval van opzet of bewuste roekeloosheid aan onze zijde.
        </Article>

        <Article number={17}>
          U staat ervoor in dat u gerechtigd bent de door u aangeleverde
          logo&apos;s, huisstijl en adresgegevens te (laten) gebruiken voor
          deze actie, en u vrijwaart ons voor aanspraken van derden – waaronder
          uw klanten en rechthebbenden op merk- of beeldmateriaal – die
          voortvloeien uit het door u aangeleverde materiaal of de door u
          aangeleverde gegevens.
        </Article>

        <Article number={18}>
          Alle door ons ontwikkelde materialen, waaronder de KWC, de brochure,
          de ambassadeursbrief en het aankondigingskaartje, blijven ons
          intellectuele eigendom. U ontvangt hierop een niet-overdraagbaar
          gebruiksrecht, uitsluitend binnen het kader van deze overeenkomst.
        </Article>

        <Article number={19}>
          In geval van overmacht worden de verplichtingen van de betrokken
          partij opgeschort. Duurt de overmachtsituatie langer dan zestig dagen,
          dan kan elk der partijen de overeenkomst schriftelijk beëindigen voor
          het deel dat niet kan worden uitgevoerd, zonder dat partijen over en
          weer tot schadevergoeding gehouden zijn.
        </Article>

        <Article number={20}>
          Buiten de proefperiode is tussentijdse opzegging gedurende de looptijd
          niet mogelijk. Elk der partijen kan de overeenkomst echter met
          onmiddellijke ingang schriftelijk ontbinden indien de andere partij in
          staat van faillissement wordt verklaard of surseance van betaling
          aanvraagt, of een essentiële verplichting na schriftelijke
          ingebrekestelling niet binnen veertien dagen alsnog nakomt.
        </Article>

        <Article number={21}>
          Op deze overeenkomst is uitsluitend Nederlands recht van toepassing.
          Partijen spannen zich in een eventueel geschil eerst in onderling
          overleg op te lossen. Lukt dat niet, dan wordt het geschil voorgelegd
          aan de bevoegde rechter van de Rechtbank Overijssel.
        </Article>

        <Article number={22}>
          Deze overeenkomst vormt, inclusief de bijlagen, de volledige afspraak
          tussen partijen en vervangt alle eerdere afspraken hierover.
          Wijzigingen en aanvullingen zijn uitsluitend geldig indien deze
          schriftelijk zijn overeengekomen. Mocht een bepaling nietig of
          vernietigbaar zijn, dan blijven de overige bepalingen onverkort van
          kracht en treden partijen in overleg over een passende vervangende
          bepaling.
        </Article>

        <SignatureBlock
          galerieParty={GALERIE_PARTY}
          galerieNaam={galerieNaam}
          galerieTweedeNaam={data.naamTweedeVertegenwoordigerGalerie}
          bedrijfsnaam={data.bedrijfsnaam}
          contactpersoon={data.contactpersoon}
          plaatsOndertekening={data.plaatsOndertekening}
          datum={datumOvereenkomst}
          variant="main"
          signatureImageUrl={signatureImageUrl}
          signedByName={signedByName}
        />
      </section>

      <AvgBijlageSjabloon2 {...signatureProps} />

      <KlachtenprotocolBijlage {...signatureProps} />
      <AdresaanleveringDocument data={data} />
    </div>
  );
}
