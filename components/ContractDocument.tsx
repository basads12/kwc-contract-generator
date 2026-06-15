import type { ContractCalculations, ContractFormData } from "@/lib/types";
import { formatDateLong, formatDateShort } from "@/lib/formatters";
import AdresaanleveringDocument from "./AdresaanleveringDocument";
import AvgBijlageSjabloon1 from "./contract/AvgBijlageSjabloon1";
import ContractLetterhead from "./contract/ContractLetterhead";
import DocumentContentRenderer, {
  DocumentContentRendererPage2,
} from "./contract/DocumentContentRenderer";
import KlachtenprotocolBijlage from "./contract/KlachtenprotocolBijlage";
import ProefperiodeBijlage from "./contract/ProefperiodeBijlage";
import SignatureBlock from "./SignatureBlock";
import { ClassicPageMarker, GALERIE_PARTY } from "./contract/shared";

interface ContractDocumentProps {
  data: ContractFormData;
  calculations: ContractCalculations;
  signatureImageUrl?: string | null;
  signedByName?: string | null;
}

export default function ContractDocument({
  data,
  calculations,
  signatureImageUrl,
  signedByName,
}: ContractDocumentProps) {
  const ingangsdatum = formatDateShort(data.ingangsdatum);
  const datumOvereenkomst = formatDateLong(data.datumOvereenkomst);
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
    <div className="contract-pages contract-pages--sjabloon1">
      <section className="a4-page a4-page--sjabloon1-main">
        <ContractLetterhead
          data={data}
          datumOvereenkomst={datumOvereenkomst}
          variant="classic"
        />

        <ClassicPageMarker page={1} total={2} />

        <DocumentContentRenderer
          data={data}
          calculations={calculations}
        />
      </section>

      <section className="a4-page a4-page--flex a4-page--sjabloon1-main">
        <ClassicPageMarker page={2} total={2} />

        <DocumentContentRendererPage2
          data={data}
          calculations={calculations}
        />

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

      <AvgBijlageSjabloon1 {...signatureProps} />
      <KlachtenprotocolBijlage {...signatureProps} />
      <AdresaanleveringDocument data={data} />
      <ProefperiodeBijlage
        {...signatureProps}
        ingangsdatum={ingangsdatum}
        proefperiodeMaanden={data.proefperiodeMaanden}
      />
    </div>
  );
}
