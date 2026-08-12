# VerzekerSlim

VerzekerSlim is een platform waarmee gebruikers in het Caribisch gebied verzekeringspremies van verschillende maatschappijen kunnen vergelijken, een premie-indicatie kunnen berekenen, en reviews kunnen plaatsen bij verzekeraars.

Dit is een monorepo met twee losse projecten:

- **`web/`** — de hoofdapplicatie (TanStack Start)
- **`docs/`** — de documentatiesite (Astro Starlight)

## Tech Stack

**`web/` (hoofdapplicatie):**

- [TanStack Start](https://tanstack.com/start) — full-stack React framework (SSR, server functions, file-based routing via TanStack Router)
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/) — database en query-laag
- [Better Auth](https://www.better-auth.com/) — authenticatie (e-mail/wachtwoord, sessies, rollen)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — styling en UI-componenten
- [TanStack Query](https://tanstack.com/query) — data fetching/caching aan de clientkant
- [Zod](https://zod.dev/) — schema-validatie
- [Biome](https://biomejs.dev/) — linting en formatting
- [Vitest](https://vitest.dev/) — testen
- [pnpm](https://pnpm.io/) — package manager

**`docs/` (documentatiesite):**

- [Astro](https://astro.build/) + [Starlight](https://starlight.astro.build/) — statische documentatiesite

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS-versie, 20 of hoger)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/) (voor een lokale PostgreSQL-database), of toegang tot een bestaande PostgreSQL-database

## Installation

Kloon de repository en installeer de dependencies voor beide projecten apart (het zijn losse pnpm-projecten, geen gedeelde workspace):

```bash
git clone <repository-url>
cd verzeker-slim
```

**Web-app:**

```bash
cd web
pnpm install
cp .env.example .env.local
# Vul DATABASE_URL en BETTER_AUTH_SECRET in .env.local in
docker compose up -d          # start een lokale PostgreSQL-database
pnpm db:push                  # zet het databaseschema klaar
```

**Docs:**

```bash
cd docs
pnpm install
```

## Usage

**Web-app starten** (vanuit `web/`):

```bash
pnpm dev
```
Bereikbaar op `http://localhost:3000`.

**Docs starten** (vanuit `docs/`):

```bash
pnpm dev
```
Bereikbaar op `http://localhost:4321`.

**Admin-account aanmaken** (vanuit `web/`):

```bash
pnpm create-admin "Naam" email@voorbeeld.com wachtwoord123
```

Zie [`web/README.md`](./web/README.md) en [`docs/README.md`](./docs/README.md) voor meer details per project.