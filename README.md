# AIML System

AI-driven Inbound Marketing Loop for the bio/pharma industry. Operational infrastructure for continuous content creation, review, and distribution.

## Overview

The AIML System is designed to solve the problem of sustained inbound marketing for highly specialized B2B industries like bio/pharma. It implements a continuous loop that automates gathering news, generating multi-language insights, and distributing them across professional channels.

### Key Capabilities

- **Automated Lifecycle**: Self-executing weekly loops via Vercel Workflows.
- **Regulatory-Aware AI**: GPT-4 powered generation with NDA-safe phrasing filters.
- **Role-Based Governance**: Strict 3-check review system for Operators and Admins.
- **Multichannel Distribution**: One-click publishing to LinkedIn, Blog, and Newsletters.

## Architecture

The system is built on a modern, high-performance stack:
- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase + Postgres
- **ORM**: Drizzle ORM
- **Automation**: Vercel Workflows (SDK v4) + Vercel Cron
- **Identity**: Supabase Auth

## Roles & Workflows

1. **Contributor**: Submits content sources and seed information.
2. **Operator**: Reviews AI-generated content, manages multi-language translations, and handles distribution.
3. **Admin**: Oversees pipeline health, system configuration, and user permissions.

---

## Setup

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The initial migration includes a database trigger that auto-creates a `profiles` row and assigns the selected **role** (Admin, Operator, or Contributor) when a new user signs up. See the [Getting Started guide](./docs/overview.md#profiles-trigger) for the SQL script.

## Environment

Copy `.env.example` to `.env` and configure:

| Variable                               | Required | Source                                           |
| -------------------------------------- | -------- | ------------------------------------------------ |
| `DATABASE_URL`                         | Yes      | Supabase > Settings > Database                   |
| `NEXT_PUBLIC_SUPABASE_URL`             | Yes      | Supabase > Settings > API                        |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes      | Supabase > Settings > API                        |
| `NEXT_PUBLIC_SITE_URL`                 | —        | Defaults to `http://localhost:3000`              |
| `RESEND_API_KEY`                       | —        | [Resend](https://resend.com) for email           |
| `RESEND_EMAIL_FROM`                    | —        | Sender address                                   |
| `UPSTASH_REDIS_REST_URL`               | —        | [Upstash](https://upstash.com) for rate limiting |
| `UPSTASH_REDIS_REST_TOKEN`             | —        | Upstash token                                    |

> **Offline development:** Run `supabase start` for a local Supabase instance. See the [full guide](./docs/overview.md#local-development-offline).

## Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Serve production build
pnpm start:all              # Dev + docs + Drizzle Studio

# Database
pnpm db:push                # Push schema to database
pnpm db:migrate <name>      # Generate a migration
pnpm db:update              # Apply pending migrations
pnpm db:studio              # Open Drizzle Studio

# Quality
pnpm lint                   # ESLint
pnpm lint:fix               # Auto-fix lint issues
pnpm format                 # Prettier

# Testing
pnpm test:unit              # Vitest
pnpm test:e2e               # Playwright (Chromium, Firefox, WebKit)
pnpm test:e2e:ui            # Playwright with UI
pnpm test:e2e:debug         # Debug mode

# Documentation
pnpm docs:dev               # VitePress dev server (port 4000)
pnpm docs:build             # Build docs site
pnpm docs:preview           # Preview production docs
```

## Project Structure

```text
app/
├── (auth)/                 # Login, register, password reset
├── (protected)/            # Role-based pages (auth-gated)
│   ├── (admin)/            # Admin section (/admin)
│   ├── (contributor)/      # Contributor section (/contributor)
│   └── (operator)/         # Operator section (/operator)
├── (public)/               # Landing page
└── api/                    # API endpoints
components/
├── ui/                     # Shadcn/ui primitives (do not modify)
├── shared/                 # Reusable components
├── app-sidebar/            # Sidebar shell
└── providers/              # Context providers
lib/
├── supabase/               # Auth + database clients
├── drizzle/                # ORM connection
├── guards/                 # Auth guard (requireAuth)
├── query/                  # React Query client + keys
├── response.ts             # API response helper
├── ratelimit.ts            # Rate limiting (Upstash)
└── seo.ts                  # Metadata helper
constants/                  # Routes, HTTP status, sidebar, SEO
schemas/                    # Zod validation schemas
services/                   # API client wrappers
queries/                    # React Query option factories
hooks/                      # Custom hooks
drizzle/                    # Database schemas + migrations
tests/                      # Unit + E2E tests
docs/                       # VitePress documentation
```

## Features

- **AI Content Loop** — GPT-4 powered generation with Tavily scraping and NDA-safe phrasing filters
- **Role-Based Workflows** — Specialized interfaces and permissions for Admin, Operator, and Contributor roles
- **Durable Workflows** — Vercel Workflows (SDK v4) for resilient, long-running processes (scraping, generation, publishing)
- **Multi-language Support** — Dynamic English and Korean content generation per source
- **Channel Distribution** — One-click publishing to LinkedIn, internal blog, and Resend newsletters
- **Governance** — Immutable audit logs and a 3-checkbox verification process for Operators
- **Rate Limiting** — Tiered Upstash Redis limits for API and Auth routes
- **CI/CD** — GitHub Actions for quality assurance and multi-browser E2E testing

## Documentation

```bash
pnpm docs:dev     # Start VitePress at http://localhost:4000
```

- **[Getting Started](./docs/overview.md)** — Setup, structure, core features
- **[Architecture Patterns](./docs/patterns/index.md)** — API response, auth guard, validation, routes, caching, status codes
- **[AGENTS.md](./AGENTS.md)** — Full developer reference

## Configuration

| File                          | Purpose                                     |
| ----------------------------- | ------------------------------------------- |
| `next.config.ts`              | Next.js (React Compiler, standalone output) |
| `tsconfig.json`               | TypeScript (strict mode)                    |
| `proxy.ts`                    | Route protection middleware                 |
| `components.json`             | Shadcn/ui configuration                     |
| `eslint.config.mjs`           | ESLint (flat config)                        |
| `.prettierrc`                 | Prettier formatting                         |
| `config/drizzle.config.ts`    | Drizzle ORM                                 |
| `config/playwright.config.ts` | Playwright E2E tests                        |
| `config/vitest.config.mts`    | Vitest unit tests                           |

## Resources

| Tool         | Link                                           |
| ------------ | ---------------------------------------------- |
| Next.js      | [nextjs.org/docs](https://nextjs.org/docs)     |
| Supabase     | [supabase.com/docs](https://supabase.com/docs) |
| Drizzle ORM  | [orm.drizzle.team](https://orm.drizzle.team)   |
| Shadcn/ui    | [ui.shadcn.com](https://ui.shadcn.com)         |
| Origin UI    | [originui.com](https://originui.com)           |
| tweakcn      | [tweakcn.com](https://tweakcn.com)             |
| Tailwind CSS | [tailwindcss.com](https://tailwindcss.com)     |
| Upstash      | [upstash.com](https://upstash.com)             |
