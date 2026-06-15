interface SignatureBlockProps {
  galerieParty: string;
  galerieNaam: string;
  galerieTweedeNaam: string;
  bedrijfsnaam: string;
  contactpersoon: string;
  plaatsOndertekening: string;
  datum: string;
  variant?: "main" | "bijlage";
  columns?: 2 | 3;
  datePrefix?: "voor-akkoord" | "none";
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
  columns: columnCount = 3,
  datePrefix = "voor-akkoord",
  signatureImageUrl,
  signedByName,
}: SignatureBlockProps) {
  const clientName = signedByName ?? contactpersoon;
  const columns: SignatureColumn[] = [
    { party: galerieParty, name: galerieNaam },
    ...(columnCount === 3
      ? [{ party: galerieParty, name: galerieTweedeNaam }]
      : []),
    {
      party: bedrijfsnaam,
      name: clientName,
      signatureImageUrl,
    },
  ];

  const dateText =
    datePrefix === "none"
      ? `${plaatsOndertekening}, ${datum}`
      : `Voor akkoord, ${plaatsOndertekening} ${datum}`;

  return (
    <div
      className={`signature-block ${variant === "main" ? "signature-block--main" : "signature-block--bijlage"}`}
    >
      <p className="signature-date">{dateText}</p>

      <table
        className={`signature-table ${columnCount === 2 ? "signature-table--two-col" : ""}`}
      >
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
