# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # ESLint check
```

No test runner is configured.

## Stack

- **Next.js 16.2.6** (App Router) + **React 19** + **TypeScript 5**
- **Supabase** — PostgreSQL database, Auth (email/password), and file Storage
- **TailwindCSS 4** + **shadcn/ui** (`src/components/ui/`) for all UI primitives
- **next-intl 4** — i18n routing and translations
- **Stripe** — payments; **Resend** — transactional email; **pdf-lib** — quote PDF generation
- **Zod** + **React Hook Form** — form validation; **@dnd-kit** — drag-and-drop in admin

## Architecture

### Route structure

Public pages live under `src/app/[locale]/` and are always locale-prefixed (`/fr/...`, `/en/...`). The admin dashboard lives under `src/app/admin/` with no locale prefix. API routes are at `src/app/api/`.

The middleware entry point is `src/middleware.ts`, which delegates to `src/proxy.ts`. That file:
- Bypasses locale handling for `/admin/*`
- Strips locale prefix if someone hits `/fr/admin/*` (redirects to `/admin/*`)
- Runs next-intl middleware for all public routes
- Guards `/mon-compte` (and sub-paths) — unauthenticated users are redirected to `/{locale}/auth/login?redirectTo=...`
- Redirects authenticated users away from `/auth/login` and `/auth/register` to `/mon-compte`

### Internationalization

Config is in `src/i18n/routing.ts`. Supported locales: `fr` (default), `en`. Translation JSON files are in `src/messages/`. Always use `useTranslations` (client) or `getTranslations` (server) from `next-intl` — never hardcode UI strings.

### Supabase clients

Three separate clients exist — use the right one:

| File | Usage |
|------|-------|
| `src/lib/supabase/client.ts` | Client Components (`createBrowserClient`) |
| `src/lib/supabase/server.ts` | Server Components, Server Actions, Route Handlers (`createServerClient` with cookie handling) |
| `src/lib/supabase/admin.ts` | Admin-only operations that must bypass RLS (uses `SUPABASE_SERVICE_ROLE_KEY`) |

### Key directories

| Path | Contents |
|------|----------|
| `src/app/[locale]/` | All localized public pages |
| `src/app/admin/` | Admin dashboard (product/order/customer CRUD) |
| `src/app/api/` | Route Handlers (orders, chat, favorites, contact) |
| `src/components/` | Feature components; `src/components/ui/` for shadcn primitives |
| `src/lib/` | Business logic — `products.ts`, `orders.ts`, `cart.ts`, `quotes.ts`, `resend.ts` |
| `src/actions/` | Server Actions (auth, forms) |
| `src/i18n/` | next-intl routing config and request helpers |
| `src/messages/` | `fr.json`, `en.json` translation files |
| `src/types/` | Shared TypeScript types |

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY      # Server/admin only — never expose to browser
```

Stripe and Resend keys are also required for payments and email.

## Key patterns

- **Server Components** are `async` by default; add `"use client"` only when needed (event handlers, hooks, browser APIs).
- **shadcn/ui** components live in `src/components/ui/` and use `class-variance-authority` + `tailwind-merge`. Add new ones with `npx shadcn add <component>`.
- **Path alias**: `@/*` maps to `src/*`.
- Admin product forms use `@dnd-kit` for reordering variants and spec sections — preserve that pattern when editing those forms.
- PDF quote generation is triggered via `POST /api/orders/[id]/generate-devis` and uses `pdf-lib` in `src/lib/devis/generateDevisPdf.ts`.
