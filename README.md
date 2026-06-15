# KWC Contract Generator

Live: [kwc-contract-generator.vercel.app](https://kwc-contract-generator.vercel.app)

Contractgenerator voor Galerie de Kunst van Kunst — opslaan, ondertekenen op iPad, klantlink en voorbereide incassomodule.

## Functies

- **Generator** (`/`) — formulier, live preview, print/PDF
- **Contracten** (`/contracten`) — overzicht met statusfilter
- **Detail** (`/contracten/[id]`) — tekenlink, downloadlink, e-mail, incasso
- **Tekenen** (`/tekenen/[token]`) — iPad-handtekening (publiek, geen login)
- **Download** (`/download/[token]`) — klant bekijkt getekend contract + PDF

### Statusflow

`CONCEPT` → `KLAAR_VOOR_ONDERTEKENING` → `GETEKEND` → `KLANTLINK_VERZONDEN` → `INCASSO_VOORBEREID` → `AFGEROND`

Tekenen is alleen mogelijk bij status **klaar voor ondertekening**.

## Omgevingsvariabelen

Kopieer `.env.example` naar `.env.local`:

| Variabele | Verplicht | Beschrijving |
|---|---|---|
| `DATABASE_URL` | Ja (productie) | PostgreSQL connection string |
| `BLOB_READ_WRITE_TOKEN` | Ja (tekenen) | Vercel Blob voor handtekeningen + PDF |
| `NEXT_PUBLIC_APP_URL` | Ja (productie) | Basis-URL voor klantlinks |
| `ADMIN_PASSWORD` | Aanbevolen | Wachtwoord voor admin-toegang |
| `AUTH_SECRET` | Optioneel | Extra secret voor sessiecookies |

Zonder `ADMIN_PASSWORD` is de app open (alleen voor lokaal testen).

## Lokaal draaien

```bash
npm install
cp .env.example .env.local
# Vul variabelen in
npm run db:migrate
npm run dev
```

## Vercel-deploy

1. Koppel **Vercel Postgres** (of Neon) → `DATABASE_URL`
2. Maak **Vercel Blob** store → `BLOB_READ_WRITE_TOKEN`
3. Zet `NEXT_PUBLIC_APP_URL=https://kwc-contract-generator.vercel.app`
4. Zet `ADMIN_PASSWORD` (sterk wachtwoord)
5. Optioneel: `AUTH_SECRET` (willekeurige string)
6. Deploy — migratie draait automatisch via `vercel.json` buildCommand

```bash
npx prisma migrate deploy   # handmatig indien nodig
```

## Stack

- Next.js 16, TypeScript, Tailwind CSS 4
- Prisma + PostgreSQL
- Vercel Blob (handtekeningen + definitieve PDF)
- jspdf + html2canvas (PDF-generatie na ondertekening)

## Nog niet actief

- Live e-mail (Resend/SendGrid) — nu mailto-placeholder
- Mollie/iDEAL/Wero — incassomodule voorbereid, geen live betaling

## Beveiliging

- Admin-routes (`/`, `/contracten`, API) vereisen login als `ADMIN_PASSWORD` is gezet
- Publiek: `/tekenen/[token]`, `/download/[token]` en bijbehorende API's
- Klantlinks gebruiken unieke tokens (geen UUID's)
