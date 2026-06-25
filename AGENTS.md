<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a single Next.js 16 (Turbopack) app — the **KWC Contract Generator** — backed by Prisma + PostgreSQL. See `README.md` for routes/feature overview and `package.json` for the canonical scripts (`dev`, `build`, `lint`, `db:deploy`).

Non-obvious caveats for running it in this environment:

- **PostgreSQL must be running and is not auto-started on boot.** Start it each session with `sudo pg_ctlcluster 16 main start`. The dev DB role/database is `kwc`/`kwc` (password `kwc`) on `localhost:5432`.
- **A local `.env` is required and is gitignored**, so it is not part of the repo. If missing, recreate it with at least:
  - `DATABASE_URL="postgresql://kwc:kwc@localhost:5432/kwc?schema=public"`
  - `NEXT_PUBLIC_APP_URL="http://localhost:3000"`
  - `ADMIN_PASSWORD="kwcdev"` (admin login password; if unset, the app is fully open with no login)
  - `AUTH_SECRET="kwc-dev-local-secret"` (optional)
  - Prisma only reads `.env` (not `.env.local`), so keep `DATABASE_URL` in `.env`.
- **Apply schema before first run:** `npm run db:deploy` (runs `prisma migrate deploy`). Migrations live in `prisma/migrations/`.
- Run the dev server with `npm run dev` (serves on `http://localhost:3000`).
- When `ADMIN_PASSWORD` is set, `/` and `/contracten` redirect to `/login`; public routes are `/tekenen/[token]` and `/download/[token]`.
- `npm run lint` currently reports one pre-existing error in `components/TemplateSelector.tsx` (`react-hooks/set-state-in-effect`) plus a few unused-var warnings — these exist on `main` and are unrelated to environment setup.
- `BLOB_READ_WRITE_TOKEN` (Vercel Blob) is only needed for the signing/PDF-upload flow; basic contract generation works without it.
