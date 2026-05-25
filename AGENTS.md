# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project

CityBasic — a multilingual travel directory ("cheat sheets" for cities). Mobile-first, SSG-first, deployed to Netlify.

## Commands

- `npm run dev` — Next.js dev server
- `npm run build` — runs `scripts/generate-image-manifest.js`, then `scripts/generate-sitemap.js`, then `next build`. Don't replace this with bare `next build` — the manifest and sitemap are build-time dependencies.
- `npm run lint` — `next lint`
- `npm run type-check` — `tsc --noEmit` (strict mode, zero errors required for production)
- `npm run validate` — runs `scripts/validate-data.js` (Zod schema check across `src/data/cities/*.json`). Run after editing any city JSON.
- `npm run analyze` — bundle analyzer (`ANALYZE=true next build`)

Node version is pinned: `.nvmrc` + `netlify.toml` (`NODE_VERSION = "22.13.0"`).

## Architecture

### Routing — locale-first App Router
All user-facing pages live under `src/app/[lang]/`. Nine locales: `en, fr, es, it, ja, hi, de, zh, ar`. Default is `en`; Arabic uses `dir="rtl"`.

`src/middleware.ts` is the locale + Supabase-session middleware. It:
1. Refreshes the Supabase session cookie on every matched request
2. Detects locale from `Accept-Language` and redirects bare paths to `/{locale}/...`
3. **Copies Supabase cookies onto redirect responses** — without this, login is lost on locale redirect. Preserve that pattern if you touch this file.

### Data model — static JSON, not a DB
City content is hand-authored JSON in `src/data/cities/`:
- `{slug}.json` — English canonical
- `{slug}-{lang}.json` — localized variants (e.g. `paris-ja.json`)

The data loader is `src/lib/getCityData.ts`:
- `getAllCities()` — reads all base (non-localized) files for index pages
- `getCityData(slug, lang)` — loads localized file, **falls back to English** if missing/corrupt
- Both wrapped in `react.cache()` so `generateMetadata` + the page component share one read per request

City pages are fully SSG. Supabase is **only** for the social layer (comments, votes, favorites, reports) — never put city/place content in the database.

### Supabase

Server-side: `src/lib/supabase/server.ts` (for Server Components, Server Actions, Route Handlers). Client-side: `src/lib/supabase/client.ts` (Client Components). Both use `@supabase/ssr`; the server module uses the `getAll/setAll` cookie adapter that mirrors `src/middleware.ts`. Auth flows through `src/app/auth/callback/`.

API routes (`src/app/api/{comments,favorites,reports,votes}/route.ts`) all require an authenticated user — RLS policies enforce this server-side as well.

### i18n & SEO
- UI strings: `src/data/dictionaries.ts` (`getDict(lang)`)
- Meta-tag translations: `src/data/seo-dictionary.ts` (`SEO_DICTIONARY`)
- City pages emit full `alternates.languages` hreflang maps; the per-page locale list sometimes differs from the global list (`zh` is omitted on the city page) — keep the two in sync intentionally, not accidentally.

### Build-time scripts
- `scripts/generate-image-manifest.js` — scans `public/images/{city}/{place}/` and writes `src/data/image-manifest.json`. Required because Netlify builds otherwise OOM on directory traversal. Runs before `next build`.
- `scripts/generate-sitemap.js` — splits into a main sitemap (cities + static pages) and item sitemaps (places), includes Google image extensions. Runs before `next build`.
- `scripts/validate-data.js` — Zod validation; build should fail if a city JSON is malformed.

### Deployment (Netlify)
`netlify.toml` deliberately **disables** the Netlify Next.js runtime plugin (`NETLIFY_USE_NEXTJS_RUNTIME = "false"`, `NETLIFY_NEXTPRO_SKIP_PLUGIN = "true"`) and publishes `.next` directly. Don't re-enable the plugin without coordinating — image manifest + sitemap workflow assumes the current build chain.

`next.config.js` defines legacy redirects from un-localized URLs (`/paris`, `/city/paris`) to `/en/city/paris` — preserve those when adding cities.

## Design system

`.Codex/SKILL.md` is the active design contract (DESIGN_VARIANCE=8, MOTION_INTENSITY=6, VISUAL_DENSITY=4 by default). Read it before frontend work. Highlights:

- **No emojis in code, markup, or alt text.** Icons via `@phosphor-icons/react` (installed) at `strokeWidth={1.5}`. `lucide-react` is also installed; new work should prefer Phosphor.
- **Tailwind v3** (`^3.4.1`) — do NOT use v4 syntax.
- **Verify `package.json` before importing a third-party library.** `framer-motion` (`^12.34.3`) and `@phosphor-icons/react` (`^2.1.10`) are installed.
- `min-h-[100dvh]`, not `h-screen`. No pure black. No 3-equal-column card layouts. No `Inter` for new work (note: the root layout currently uses Inter — don't propagate it to new components).
- City page `src/app/[lang]/city/[citySlug]/page.tsx` has a per-page DESIGN_VARIANCE override of 5 — keep the typography rules in the memory file when editing the hero (decorative city fonts like Modak/Geo/Corinthia/Playball must stay at `font-normal`).
- `MagneticItineraryButton`: never add `block` to its flex Link — it collapses the layout. See memory notes if you touch it.

## Conventions

- TS strict, path alias `@/*` → `src/*`
- Server Components by default; `"use client"` only when needed (state, events, browser APIs, perpetual animations)
- All async API routes wrap in `try/catch`; log with `console.error`
- All external/JSON data goes through Zod (see `scripts/validate-data.js` for the canonical city schema)
- Analytics events flow through `src/hooks/useAnalytics.ts`; the North Star event is `copy_name_local`
- Ad slots must have a fixed `min-height` (CLS prevention) — never collapse an empty slot

## Rules

Rule 2: Challenge the direction
Think critically about the direction we're heading. If you think this isn't the most optimized path for me to reach my goal in the shortest time, suggest a better alternative. Don't just execute — push back when there's a faster, smarter, or more effective way to get where I'm trying to go.

Rule 3: 9/10 quality gate
No content gets published or saved to Airtable until it scores a 9/10 or higher. Rate every piece of content honestly and neutrally — no inflating scores to move things along. If it's not a 9, say what's wrong and fix it before proceeding. A 10 only exists after the data comes back. Score based on: hook strength (specificity, numbers, tension), body structure (winning formula compliance), originality (would someone screenshot this?), and CTA clarity. Be direct about what's dragging the score down.

Rule 4: Test before you respond
After making any code changes, run the relevant tests or start the dev server to check for errors before responding. Never say "done" if the code is untested.

Rule 5: Context
Always find ways to reduce the context window usage or context across all files. If there's a way to keep things operating the same, but use less context, please optimize and let me know. Please remove ALL files that are redundant or unnecessary. Keep things as simple as possible.

Rule 6: System upgrade suggestion
At the END of every skill run, add one actionable improvement suggestion to references/system-upgrades.md. This should be something Jono isn't doing yet — a workflow gap, missed data opportunity, new automation idea, content repurposing angle, or anything else you noticed during the run. Be specific, not generic. This turns every skill run into a compounding improvement loop.
