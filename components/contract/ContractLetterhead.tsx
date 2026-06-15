import type { ContractFormData } from "@/lib/types";
import { GALERIE_ADDRESS, GALERIE_PARTY } from "./shared";

interface ContractLetterheadProps {
  data: ContractFormData;
  datumOvereenkomst: string;
  variant?: "standard" | "classic";
}

export default function ContractLetterhead({
  data,
  datumOvereenkomst,
  variant = "standard",
}: ContractLetterheadProps) {
  const attn = data.aanhef ? (
    <>
      T.a.v. {data.aanhef}{" "}
      <span className="contract-recipient__attn-name">{data.contactpersoon}</span>
    </>
  ) : (
    <>T.a.v. {data.contactpersoon}</>
  );

  if (variant === "classic") {
    return (
      <div className="contract-letterhead contract-letterhead--classic">
        <div className="contract-recipient-classic">
          <div className="contract-recipient-classic__lines">
            <p>{data.bedrijfsnaam}</p>
            <p className="contract-recipient__attn">{attn}</p>
            <p>{data.adres}</p>
            <p>
              {data.postcode} {data.plaats}
            </p>
          </div>
          <p className="contract-recipient-classic__meta">
            <span className="contract-recipient-classic__date">
              {data.plaatsOndertekening}, {datumOvereenkomst}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="contract-sender">
        <p className="contract-sender__name">{GALERIE_PARTY}</p>
        <p className="contract-sender__address">{GALERIE_ADDRESS}</p>
      </div>

      <div className="contract-recipient">
        <div className="contract-recipient__row">
          <p className="contract-recipient__company">{data.bedrijfsnaam}</p>
          <p className="contract-recipient__date">
            {data.plaatsOndertekening}, {datumOvereenkomst}
          </p>
        </div>
        <p className="contract-recipient__attn">{attn}</p>
        <p>{data.adres}</p>
        <p>
          {data.postcode} {data.plaats}
        </p>
      </div>
    </>
  );
}
