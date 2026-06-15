import type { ReactNode } from "react";
import {
  formatCurrency,
  formatCurrencyArt7Monthly,
  formatCurrencyDecimal,
} from "@/lib/formatters";

export const GALERIE_PARTY = "Galerie De Kunst van Kunst\u00a0BV";
export const GALERIE_ADDRESS = "Geerdinksweg 2, 7555 DM Hengelo";
export const MAIN_CONTRACT_TITLE = "Overeenkomst Kunst-Waardecheques (KWC)";

export function Currency({ amount }: { amount: number }) {
  return <span className="contract-amount">{formatCurrency(amount)}</span>;
}

export function CurrencyDecimal({ amount }: { amount: number }) {
  return (
    <span className="contract-amount">{formatCurrencyDecimal(amount)}</span>
  );
}

export function CurrencyArt7Monthly({ amount }: { amount: number }) {
  return (
    <span className="contract-amount">
      {formatCurrencyArt7Monthly(amount)}
    </span>
  );
}

export function MainContractPageHeader({
  page,
  total,
}: {
  page: number;
  total: number;
}) {
  return (
    <div className="contract-main-page-header">
      <h1 className="contract-heading1 contract-main-page-header__title">
        {MAIN_CONTRACT_TITLE}
      </h1>
      <p className="contract-main-page-header__page">
        pagina {page}/{total}
      </p>
    </div>
  );
}

export function ClassicPageMarker({
  page,
  total,
}: {
  page: number;
  total: number;
}) {
  return (
    <p className="contract-page-marker">
      pagina {page}/{total}
    </p>
  );
}

export function Article({
  number,
  title,
  children,
}: {
  number: number;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="contract-article">
      <span className="contract-article__number">{number}.</span>
      <div className="contract-article__body">
        {title ? (
          <>
            <span className="contract-article__title">{title}</span> {children}
          </>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function DashItem({
  children,
  nested = false,
}: {
  children: ReactNode;
  nested?: boolean;
}) {
  return (
    <div
      className={
        nested ? "contract-dash-item contract-dash-item--nested" : "contract-dash-item"
      }
    >
      <span className="contract-dash-item__marker" aria-hidden="true">
        –
      </span>
      <div className="contract-dash-item__body">{children}</div>
    </div>
  );
}

export function Paragraph({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={
        className ? `${className} contract-paragraph` : "contract-paragraph"
      }
    >
      {children}
    </p>
  );
}
