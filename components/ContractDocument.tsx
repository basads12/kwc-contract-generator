import type { ContractCalculations, ContractFormData } from "@/lib/types";
import { formatDateLong } from "@/lib/formatters";
import AdresaanleveringDocument from "./AdresaanleveringDocument";
import AvgBijlageSjabloon1 from "./contract/AvgBijlageSjabloon1";
import ContractLetterhead from "./contract/ContractLetterhead";
import DocumentContentRenderer, {
  DocumentContentRendererPage2,
} from "./contract/DocumentContentRenderer";
import KlachtenprotocolBijlage from "./contract/KlachtenprotocolBijlage";
import SignatureBlock from "./SignatureBlock";
import { GALERIE_PARTY, ContractPageNumber, MainContractPageHeader } from "./contract/shared";

interface ContractDocumentProps {
  data: ContractFormData;
  calculations: ContractCalculations;
  signatureImageUrl?: string | null;
  signedByName?: string | null;
  editable?: boolean;
  onDocumentContentChange?: (content: import("@/lib/documentContent").DocumentContent) => void;
}

export default function ContractDocument({
  data,
  calculations,
  signatureImageUrl,
  signedByName,
  editable = false,
  onDocumentContentChange,
}: ContractDocumentProps) {
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
      <section className="a4-page a4-page--sjabloon1-main contract-print-hoofdcontract">
        <ContractLetterhead data={data} datumOvereenkomst={datumOvereenkomst} />

        <MainContractPageHeader />

        <DocumentContentRenderer
          data={data}
          calculations={calculations}
          editable={editable}
          onContentChange={onDocumentContentChange}
        />

        <ContractPageNumber page={1} />
      </section>

      <section className="a4-page a4-page--flex a4-page--sjabloon1-main contract-print-hoofdcontract">
        <MainContractPageHeader />

        <DocumentContentRendererPage2
          data={data}
          calculations={calculations}
          editable={editable}
          onContentChange={onDocumentContentChange}
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

        <ContractPageNumber page={2} />
      </section>

      <AvgBijlageSjabloon1 {...signatureProps} />
      <KlachtenprotocolBijlage {...signatureProps} />
      <AdresaanleveringDocument data={data} />
    </div>
  );
}
