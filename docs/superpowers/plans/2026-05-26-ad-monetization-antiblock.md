# Ad Monetization Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a friendly French-language anti-adblock notice, a one-per-city-session interstitial trigger, and two high-visibility display ad slots on the home page.

**Architecture:** Three independent client-only subsystems — a bait-element adblock detector mounted in the lang layout, a document-level click listener (Client Component) dropped into the SSG city page to fire a single pop-under per citySlug per session, and two `AdsterraBanner` instances injected into `HomePageClient`. All ad logic is isolated in `src/components/ads/`; no server-side changes are needed.

**Tech Stack:** Next.js 15 App Router, React 18 (`useEffect`, `useRef`, `useState`), `sessionStorage` (browser-only), existing `AdsterraBanner` component, Tailwind v3.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/ads/AdblockDetector.tsx` | **Create** | Bait element + French message bar |
| `src/components/ads/useCityInterstitial.ts` | **Create** | sessionStorage hook: check/set per citySlug |
| `src/components/ads/CityInterstitialController.tsx` | **Create** | Client Component — event delegation for city page clicks |
| `src/components/ads/AdsterraDisplayBanner.tsx` | **Create** | Thin wrapper around existing `AdsterraBanner` with named-size API + CLS container |
| `src/app/[lang]/layout.tsx` | **Modify** | Add `<AdblockDetector />` after `<Footer />` |
| `src/app/[lang]/city/[citySlug]/page.tsx` | **Modify** | Add `<CityInterstitialController citySlug={citySlug} />` inside `<main>` |
| `src/components/pages/HomePageClient.tsx` | **Modify** | Add two `AdsterraDisplayBanner` slots: below hero fold, above closing `</main>` |

---

## Pre-flight: Direct Link env var

Before executing tasks, confirm that `NEXT_PUBLIC_ADSTERRA_DIRECT_LINK` is set in `.env.local` (or Netlify env vars):

```
NEXT_PUBLIC_ADSTERRA_DIRECT_LINK=https://your-adsterra-direct-link-here
```

The `CityInterstitialController` reads this at runtime. The build does **not** fail if it is absent — the controller silently skips firing in that case.

---

## Task 1: AdblockDetector — bait element + French message bar

**Files:**
- Create: `src/components/ads/AdblockDetector.tsx`

- [ ] **Step 1: Create the component file**

```tsx
'use client'

import { useEffect, useState } from 'react'

export function AdblockDetector() {
  const [detected, setDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Inject bait element — adblock extensions hide/remove elements with these class names
    const bait = document.createElement('div')
    bait.className = 'pub-banner ad-zone adsbox'
    bait.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(bait)

    // Delay check so extensions have time to process the DOM
    const timer = setTimeout(() => {
      const style = window.getComputedStyle(bait)
      const hidden =
        bait.offsetHeight === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'

      if (hidden) setDetected(true)
      document.body.removeChild(bait)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (document.body.contains(bait)) document.body.removeChild(bait)
    }
  }, [])

  if (!detected || dismissed) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-amber-50 border-t border-amber-200
        px-4 py-3 md:py-4
        flex items-start md:items-center justify-between gap-3
        shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.08)]
      "
    >
      <p className="text-sm text-amber-900 font-medium leading-snug max-w-prose">
        S&apos;il vous plaît, désactivez votre bloqueur de publicité. Je ne veux
        pas vous bloquer l&apos;accès au site, mais si vous pouvez le faire, ce
        serait vraiment sympa de soutenir mon travail&nbsp;!
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
        className="
          shrink-0 w-7 h-7 rounded-full
          flex items-center justify-center
          text-amber-700 hover:bg-amber-100
          transition-colors duration-150
          active:scale-[0.95]
        "
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
```

- [ ] **Step 2: Verify the file was created correctly**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no new errors from `AdblockDetector.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/AdblockDetector.tsx
git commit -m "feat(ads): add AdblockDetector with bait-element technique and French notice bar"
```

---

## Task 2: useCityInterstitial — sessionStorage hook

**Files:**
- Create: `src/components/ads/useCityInterstitial.ts`

- [ ] **Step 1: Create the hook file**

```ts
import { useCallback } from 'react'

const SESSION_PREFIX = 'cityad_shown_'

export function useCityInterstitial(citySlug: string) {
  const hasShown = useCallback((): boolean => {
    if (typeof sessionStorage === 'undefined') return true
    return sessionStorage.getItem(`${SESSION_PREFIX}${citySlug}`) === '1'
  }, [citySlug])

  const markShown = useCallback((): void => {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(`${SESSION_PREFIX}${citySlug}`, '1')
  }, [citySlug])

  return { hasShown, markShown }
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors from `useCityInterstitial.ts`

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/useCityInterstitial.ts
git commit -m "feat(ads): add useCityInterstitial hook for per-city sessionStorage ad tracking"
```

---

## Task 3: CityInterstitialController — event delegation Client Component

**Files:**
- Create: `src/components/ads/CityInterstitialController.tsx`

This component renders `null` (invisible), but registers a document-level click listener that fires the pop-under exactly once per citySlug per browser session. It silently no-ops if the env var is absent.

- [ ] **Step 1: Create the component file**

```tsx
'use client'

import { useEffect } from 'react'
import { useCityInterstitial } from './useCityInterstitial'

interface CityInterstitialControllerProps {
  citySlug: string
}

export function CityInterstitialController({
  citySlug,
}: CityInterstitialControllerProps) {
  const { hasShown, markShown } = useCityInterstitial(citySlug)

  useEffect(() => {
    const directLink = process.env.NEXT_PUBLIC_ADSTERRA_DIRECT_LINK
    if (!directLink) return

    const handleClick = (e: MouseEvent) => {
      // Only react to link clicks
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      // Ignore external / nav links — only city content links
      const href = anchor.getAttribute('href') || ''
      if (!href.startsWith('/') && !href.startsWith(window.location.origin)) return
      // Ignore navigation links (CityNavigation, Header) by checking they stay in city scope
      if (!href.includes(`/city/${citySlug}`)) return

      if (hasShown()) return

      markShown()
      window.open(directLink, '_blank', 'noopener,noreferrer')
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [citySlug, hasShown, markShown])

  return null
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors from `CityInterstitialController.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/CityInterstitialController.tsx
git commit -m "feat(ads): add CityInterstitialController for one-per-city session pop-under"
```

---

## Task 4: Wire CityInterstitialController into city page

**Files:**
- Modify: `src/app/[lang]/city/[citySlug]/page.tsx` (lines 17–18 import block, and inside `<main>`)

- [ ] **Step 1: Add the import**

In `src/app/[lang]/city/[citySlug]/page.tsx`, add after the existing `AdsterraSmartFrame` import (line 17):

```tsx
import { CityInterstitialController } from '@/components/ads/CityInterstitialController'
```

- [ ] **Step 2: Mount the controller inside `<main>`**

In the same file, find the opening `<main>` tag (line 235):

```tsx
<main className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 pb-20">
```

Add `CityInterstitialController` as the first child:

```tsx
<main className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 pb-20">
  <CityInterstitialController citySlug={citySlug} />
  <CityNavigation lang={lang} dict={dict} />
  {/* ... rest unchanged ... */}
```

- [ ] **Step 3: Verify types and build**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/[lang]/city/[citySlug]/page.tsx
git commit -m "feat(ads): mount CityInterstitialController on city page"
```

---

## Task 5: AdsterraDisplayBanner — named-size reusable wrapper

**Files:**
- Create: `src/components/ads/AdsterraDisplayBanner.tsx`

This wraps the existing `AdsterraBanner` with a named-size API and a guaranteed CLS-safe min-height container. Two sizes are used on the home page: `leaderboard` (728×90) and `medium-rectangle` (300×250).

- [ ] **Step 1: Create the component**

```tsx
'use client'

import AdsterraBanner from './AdsterraBanner'

type DisplaySize = 'leaderboard' | 'medium-rectangle' | 'half-page' | 'billboard'

interface AdsterraDisplayBannerProps {
  size: DisplaySize
  pKey: string
  className?: string
}

const SIZE_MAP: Record<DisplaySize, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  'medium-rectangle': { width: 300, height: 250 },
  'half-page': { width: 300, height: 600 },
  billboard: { width: 970, height: 250 },
}

export function AdsterraDisplayBanner({
  size,
  pKey,
  className = '',
}: AdsterraDisplayBannerProps) {
  const { width, height } = SIZE_MAP[size]

  return (
    <div
      className={`flex justify-center items-center overflow-hidden ${className}`}
      style={{ minHeight: height }}
      aria-hidden="true"
    >
      <AdsterraBanner width={width} height={height} pKey={pKey} />
    </div>
  )
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/AdsterraDisplayBanner.tsx
git commit -m "feat(ads): add AdsterraDisplayBanner with named-size API and CLS-safe container"
```

---

## Task 6: Add two display ad slots to HomePageClient

**Files:**
- Modify: `src/components/pages/HomePageClient.tsx`

Two placements:
1. **Below hero fold** — after the hero `<section>` closing tag (line 47) and before the map section
2. **Above closing `</main>`** — after the last cities grid `</section>` closing tag (line 91)

- [ ] **Step 1: Add the import**

At the top of `src/components/pages/HomePageClient.tsx`, add after the existing imports:

```tsx
import { AdsterraDisplayBanner } from '@/components/ads/AdsterraDisplayBanner'
```

- [ ] **Step 2: Insert slot 1 — below hero fold**

Find the hero section closing tag (line 47):

```tsx
      </section>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
```

Replace with:

```tsx
      </section>

      {/* Ad slot: below hero fold */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-center">
        <AdsterraDisplayBanner
          size="leaderboard"
          pKey="258fbd7f9475277565c29c04ed1299f6"
        />
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
```

The `pKey` here matches the existing banner already used on this page (`src/app/[lang]/page.tsx` line 39).

- [ ] **Step 3: Insert slot 2 — above closing `</main>`**

Find the closing of the city grid section (line 91):

```tsx
      </section>
    </main>
```

Replace with:

```tsx
      </section>

      {/* Ad slot: above footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-center">
        <AdsterraDisplayBanner
          size="leaderboard"
          pKey="258fbd7f9475277565c29c04ed1299f6"
        />
      </div>
    </main>
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors from `HomePageClient.tsx`

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/HomePageClient.tsx
git commit -m "feat(ads): add two leaderboard display ad slots to home page (below hero, above footer)"
```

---

## Task 7: Wire AdblockDetector into the lang layout

**Files:**
- Modify: `src/app/[lang]/layout.tsx`

The detector goes after `<CookieConsent />` (line 100) so it layers above it using z-index (the detector uses `z-50`, `CookieConsent` should use a lower z — verify before merging).

- [ ] **Step 1: Add the import**

In `src/app/[lang]/layout.tsx`, add after the existing `CookieConsent` import (line 15):

```tsx
import { AdblockDetector } from '@/components/ads/AdblockDetector'
```

- [ ] **Step 2: Mount after CookieConsent**

Find (line 100):

```tsx
            <CookieConsent />
            </AvailableLanguagesProvider>
```

Replace with:

```tsx
            <CookieConsent />
            <AdblockDetector />
            </AvailableLanguagesProvider>
```

- [ ] **Step 3: Check CookieConsent z-index doesn't clash**

Run: `grep -r "z-" src/components/features/CookieConsent.tsx`

If `CookieConsent` also uses `z-50` or higher, bump `AdblockDetector` to `z-[51]` in its className. If `CookieConsent` uses a lower z, no change needed.

- [ ] **Step 4: Verify types and build**

Run: `npx tsc --noEmit 2>&1 | head -20`
Expected: no errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[lang]/layout.tsx
git commit -m "feat(ads): mount AdblockDetector in lang layout"
```

---

## Task 8: Smoke-test all three features

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Navigate to `http://localhost:3000/en`

- [ ] **Step 2: Test home page ads**

Check both ad banner slots render with their `minHeight` container — no layout shift visible when page loads. Open DevTools → Network → filter "repelaffinityworlds.com" — two requests should appear.

- [ ] **Step 3: Test adblock detector (no adblock)**

With no extension active, open `http://localhost:3000/en`. The amber bar must NOT appear.

- [ ] **Step 4: Test adblock detector (with adblock)**

Enable uBlock Origin or similar. Reload `http://localhost:3000/en`. The amber bar should appear at the bottom after ~300ms. Click the X — it should dismiss.

- [ ] **Step 5: Test city interstitial**

Navigate to `http://localhost:3000/en/city/bangkok`. Click any `<a>` link that stays within `/city/bangkok` (e.g. a place card). A new tab should open to the Adsterra direct link. Click another link in the same city — no new tab. Navigate home, then to `/en/city/paris`, click a link — one new tab for Paris. Confirm `sessionStorage` keys `cityad_shown_bangkok` and `cityad_shown_paris` are both set.

- [ ] **Step 6: Commit smoke-test sign-off (no code changes needed)**

---

## Self-Review Checklist

**Spec coverage:**
- [x] Bait element technique with class names `pub-banner`, `ad-zone`, `adsbox`
- [x] 300ms delayed hydration check via `useEffect`
- [x] French-language exact message text preserved (with HTML entity escapes for apostrophes)
- [x] Non-blocking — user can dismiss or ignore and continue using the site
- [x] sessionStorage keyed by `citySlug` (`cityad_shown_{slug}`)
- [x] One pop-under per city per session, resets on new city navigation
- [x] `AdsterraDisplayBanner` with configurable size/pKey parameter
- [x] Two home page slots: below hero, above footer
- [x] `min-height` on all ad containers (CLS prevention)
- [x] All ad logic isolated to `'use client'` components — no server-side pollution

**Placeholder scan:** None found. All pKey values use the existing production key from `src/app/[lang]/page.tsx`.

**Type consistency:** `useCityInterstitial` exports `{ hasShown, markShown }` — both referenced by exact name in `CityInterstitialController`.
