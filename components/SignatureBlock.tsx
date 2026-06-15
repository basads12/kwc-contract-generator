interface SignatureBlockProps {
  galerieParty: string;
  galerieNaam: string;
  galerieTweedeNaam: string;
  bedrijfsnaam: string;
  contactpersoon: string;
  plaatsOndertekening: string;
  datum: string;
  variant?: "main" | "bijlage";
  signatureImageUrl?: string | null;
  signedByName?: string | null;
}

interface SignatureColumn {
  party: string;
  name: string;
  signatureImageUrl?: string | null;
}

export default function SignatureBlock({
  galerieParty,
  galerieNaam,
  galerieTweedeNaam,
  bedrijfsnaam,
  contactpersoon,
  plaatsOndertekening,
  datum,
  variant = "main",
  signatureImageUrl,
  signedByName,
}: SignatureBlockProps) {
  const clientName = signedByName ?? contactpersoon;
  const columns: SignatureColumn[] = [
    { party: galerieParty, name: galerieNaam },
    { party: galerieParty, name: galerieTweedeNaam },
    {
      party: bedrijfsnaam,
      name: clientName,
      signatureImageUrl,
    },
  ];

  return (
    <div
      className={`signature-block ${variant === "main" ? "signature-block--main" : "signature-block--bijlage"}`}
    >
      <p className="signature-date">
        Voor akkoord, {plaatsOndertekening} {datum}
      </p>

      <table className="signature-table">
        <tbody>
          <tr className="signature-table__party-row">
            {columns.map((column) => (
              <td key={`party-${column.name}`}>
                <p className="signature-party">{column.party}</p>
              </td>
            ))}
          </tr>
          <tr className="signature-table__name-row">
            {columns.map((column) => (
              <td key={`name-${column.name}`}>
                <p className="signature-name">{column.name}</p>
              </td>
            ))}
          </tr>
          <tr className="signature-table__sign-row">
            {columns.map((column) => (
              <td key={`sign-${column.name}`}>
                {column.signatureImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={column.signatureImageUrl}
                    alt="Handtekening"
                    className="signature-image"
                  />
                ) : null}
              </td>
            ))}
          </tr>
          <tr className="signature-table__line-row">
            {columns.map((column) => (
              <td key={`line-${column.name}`}>
                <div className="signature-line" />
              </td>
            ))}
          </tr>
          <tr className="signature-table__label-row">
            {columns.map((column) => (
              <td key={`label-${column.name}`}>
                <p className="signature-label">Handtekening</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
