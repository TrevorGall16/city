# Ad Density Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ad prominence (modal adblock gate, sticky city sidebar, top-of-page place banner) and add a third home page slot between the world map and city grid.

**Architecture:** Four independent surface areas — `AdblockDetector` becomes a viewport-centered modal; `HomePageClient` gains a third banner zone with distinct pKeys per slot; a new `AdsterraSidebarBanner` component is wired into a two-column grid wrapping the city page's scrollable content; the place detail page gains a horizontal banner immediately after its breadcrumb nav.

**Tech Stack:** React 18 (`useEffect`, `useRef`, `useState`), Tailwind v3, existing `AdsterraBanner` + `AdsterraSmartFrame` components.

---

## Pre-flight: Remove debug override in AdblockDetector

The file currently contains an unconditional `setDetected(true)` on line 28 for localhost testing. **This line must be removed before any of the four tasks run.** Task 1 handles this as its first step.

---

## File Map

| File | Action | Reason |
|------|--------|--------|
| `src/components/ads/AdblockDetector.tsx` | **Modify** | Convert bottom bar → centered modal; remove debug line |
| `src/components/pages/HomePageClient.tsx` | **Modify** | Add third ad slot (map → grid gap); document pKey uniqueness |
| `src/components/ads/AdsterraSidebarBanner.tsx` | **Create** | Vertical 300×600 ad component |
| `src/app/[lang]/city/[citySlug]/page.tsx` | **Modify** | Wrap scrollable sections in `grid-cols-[1fr_300px]` with sticky right column |
| `src/app/[lang]/city/[citySlug]/[placeSlug]/page.tsx` | **Modify** | Add top horizontal banner after breadcrumb nav |

---

## Task 1: AdblockDetector — centered modal overhaul

**Files:**
- Modify: `src/components/ads/AdblockDetector.tsx`

The current component has:
- An unconditional `setDetected(true)` on line 28 (debug, must be removed)
- A bottom sticky bar layout

Replace the entire file with a modal variant. The English text the user set stays exactly as-is. The user must click X to dismiss before interacting with the page.

- [ ] **Step 1: Replace the file contents**

```tsx
'use client'

import React, { useEffect, useState } from 'react'

export function AdblockDetector(): React.ReactElement | null {
  const [detected, setDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const bait = document.createElement('div')
    bait.className = 'pub-banner ad-zone adsbox'
    bait.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(bait)

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
      className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ad blocker notice"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            One small ask
          </h2>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="
              shrink-0 w-7 h-7 rounded-full
              flex items-center justify-center
              text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800
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

        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Please, if you could disable your ad blocker it would really help me as a
          solo developer. I&apos;m not going to block you from using the website
          even with ads, but if you could disable it, that would be cool from your
          part. Thank you!
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="
            mt-6 w-full px-4 py-2.5 rounded-xl
            bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white
            text-white dark:text-zinc-900
            text-sm font-bold
            transition-all duration-200
            active:scale-[0.98]
          "
        >
          Got it, I&apos;ll consider it
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify type-check**

Run: `cd D:\Projects\Website\CitySheet\city && npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/AdblockDetector.tsx
git commit -m "feat(ads): convert AdblockDetector from bottom bar to centered viewport modal"
```

---

## Task 2: HomePageClient — third ad slot + pKey uniqueness

**Files:**
- Modify: `src/components/pages/HomePageClient.tsx`

The current layout has two leaderboard slots both using pKey `258fbd7f9475277565c29c04ed1299f6`. Multiple Adsterra banners with the same key on a single page may result in only the first rendering. Each zone needs a distinct key.

**Current structure:**
1. Hero section
2. Ad slot 1 (leaderboard, pKey A) — below hero
3. World map section
4. City grid section
5. Ad slot 2 (leaderboard, pKey A) — above footer

**Target structure:**
1. Hero section
2. Ad slot 1 (leaderboard, pKey A) — below hero ← keep existing pKey
3. World map section
4. **Ad slot 3 (medium-rectangle, pKey B) — between map and city grid** ← new
5. City grid section
6. Ad slot 2 (leaderboard, pKey A) — above footer ← slot 2 keeps same pKey (different DOM node, different `bannerRef`, loads independently)

> **pKey note:** Slots 1 and 2 can share a key if they are the only two on the page from the same network zone. Slot 3 uses a different size (`medium-rectangle`) and should use a different Adsterra key if your account has a dedicated 300×250 zone. Replace `"REPLACE_WITH_MEDIUM_RECT_KEY"` in the code below with your real 300×250 zone key before going to production.

- [ ] **Step 1: Add third slot between world map and city grid**

Find in `HomePageClient.tsx` (lines 66–68):
```tsx
      </section>

      <section ref={gridRef} className="max-w-[1400px] mx-auto px-6 py-20">
```

Replace with:
```tsx
      </section>

      {/* Ad slot: between world map and city grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex justify-center">
        <AdsterraDisplayBanner
          size="medium-rectangle"
          pKey="REPLACE_WITH_MEDIUM_RECT_KEY"
        />
      </div>

      <section ref={gridRef} className="max-w-[1400px] mx-auto px-6 py-20">
```

- [ ] **Step 2: Verify no duplicate key warnings and type-check**

Run: `cd D:\Projects\Website\CitySheet\city && npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/components/pages/HomePageClient.tsx
git commit -m "feat(ads): add third home page ad slot between world map and city grid"
```

---

## Task 3: AdsterraSidebarBanner — vertical sticky ad component

**Files:**
- Create: `src/components/ads/AdsterraSidebarBanner.tsx`

A thin wrapper around `AdsterraSmartFrame` configured for 300×600 (half-page) dimensions. Exposes a `pKey` prop and enforces `min-height` for CLS prevention.

- [ ] **Step 1: Create the file**

```tsx
'use client'

import AdsterraSmartFrame from './AdsterraSmartFrame'

interface AdsterraSidebarBannerProps {
  pKey: string
}

export function AdsterraSidebarBanner({
  pKey,
}: AdsterraSidebarBannerProps): React.ReactElement {
  return (
    <div
      className="w-[300px] overflow-hidden rounded-xl"
      style={{ minHeight: 600 }}
      aria-hidden="true"
    >
      <AdsterraSmartFrame
        height={600}
        width={300}
        pKey={pKey}
      />
    </div>
  )
}
```

Add `import React from 'react'` at the top (needed for the explicit `React.ReactElement` return type).

Full file:

```tsx
'use client'

import React from 'react'
import AdsterraSmartFrame from './AdsterraSmartFrame'

interface AdsterraSidebarBannerProps {
  pKey: string
}

export function AdsterraSidebarBanner({
  pKey,
}: AdsterraSidebarBannerProps): React.ReactElement {
  return (
    <div
      className="w-[300px] overflow-hidden rounded-xl"
      style={{ minHeight: 600 }}
      aria-hidden="true"
    >
      <AdsterraSmartFrame
        height={600}
        width={300}
        pKey={pKey}
      />
    </div>
  )
}
```

- [ ] **Step 2: Verify type-check**

Run: `cd D:\Projects\Website\CitySheet\city && npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ads/AdsterraSidebarBanner.tsx
git commit -m "feat(ads): add AdsterraSidebarBanner component for 300x600 sticky placement"
```

---

## Task 4: City page — asymmetric two-column grid with sticky sidebar

**Files:**
- Modify: `src/app/[lang]/city/[citySlug]/page.tsx`

### Strategy

The city page has two full-bleed sections that must stay full-width:
- The hero (`section.relative min-h-[100dvh]`) — full bleed, cannot go in a column
- The bento board section — spans full `max-w-[1400px]`

Everything below the bento board (sections 3–12: dashboard, weather, neighborhoods, ads, culture, itineraries, attractions, food, logistics, comments) will be wrapped in a single asymmetric grid container. The right column contains the sticky sidebar; the left column contains the original section content.

The sections currently have their own `max-w-[1400px] mx-auto px-4 md:px-8` wrappers. Inside the grid's left column, those outer wrappers become redundant — but to minimize refactoring risk, **leave the inner wrappers intact** and simply set `overflow-hidden` on the left column. The left column naturally constrains its children.

### Import to add

After the existing `AdsterraSmartFrame` import, add:
```tsx
import { AdsterraSidebarBanner } from '@/components/ads/AdsterraSidebarBanner'
```

### Structural change

Find the opening of the section after the bento board (the `ChinaAppGuide` line, approximately line 400 in the existing file):

```tsx
          {/* China Survival Guide */}
          <ChinaAppGuide countryCode={city.country_code} />
```

**Before that line**, open a two-column wrapper:

```tsx
          {/* ── SCROLLABLE CONTENT + STICKY SIDEBAR ──────────────────────── */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

              {/* LEFT COLUMN: all remaining page sections */}
              <div className="min-w-0">

                {/* China Survival Guide */}
                <ChinaAppGuide countryCode={city.country_code} />
```

Then find the `</section>` that closes the comments section (the last section before `</main>`):

```tsx
          <section className="max-w-[900px] mx-auto px-4 py-24 border-t border-slate-200 dark:border-zinc-800">
            <CommentThread citySlug={citySlug} lang={lang} dict={dict} />
          </section>
        </main>
```

After that comments section closing tag, **close the left column div, add the right sidebar column, then close the grid wrapper and the outer container**:

```tsx
          <section className="max-w-[900px] mx-auto px-4 py-24 border-t border-slate-200 dark:border-zinc-800">
            <CommentThread citySlug={citySlug} lang={lang} dict={dict} />
          </section>

              </div>{/* end left column */}

              {/* RIGHT COLUMN: sticky sidebar */}
              <div className="hidden lg:block self-start sticky top-24">
                <AdsterraSidebarBanner pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
              </div>

            </div>{/* end grid */}
          </div>{/* end outer container */}

        </main>
```

> **pKey note:** The sidebar uses the same `81531fc7e6a8cf5cc6de9e368b8f2c11` key already in production on this page. If you have a dedicated 300×600 Adsterra zone, swap it in here.

- [ ] **Step 1: Add import**

In `src/app/[lang]/city/[citySlug]/page.tsx`, after line 17 (`import AdsterraSmartFrame ...`):

```tsx
import { AdsterraSidebarBanner } from '@/components/ads/AdsterraSidebarBanner'
```

- [ ] **Step 2: Wrap scrollable content — open grid before ChinaAppGuide**

Find:
```tsx
          {/* China Survival Guide */}
          <ChinaAppGuide countryCode={city.country_code} />
```

Replace with:
```tsx
          {/* ── SCROLLABLE CONTENT + STICKY SIDEBAR ──────────────────────── */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
              <div className="min-w-0">

                {/* China Survival Guide */}
                <ChinaAppGuide countryCode={city.country_code} />
```

- [ ] **Step 3: Close grid after CommentThread**

Find:
```tsx
          <section className="max-w-[900px] mx-auto px-4 py-24 border-t border-slate-200 dark:border-zinc-800">
            <CommentThread citySlug={citySlug} lang={lang} dict={dict} />
          </section>
        </main>
```

Replace with:
```tsx
          <section className="max-w-[900px] mx-auto px-4 py-24 border-t border-slate-200 dark:border-zinc-800">
            <CommentThread citySlug={citySlug} lang={lang} dict={dict} />
          </section>

              </div>

              <div className="hidden lg:block self-start sticky top-24">
                <AdsterraSidebarBanner pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
              </div>

            </div>
          </div>

        </main>
```

- [ ] **Step 4: Verify type-check**

Run: `cd D:\Projects\Website\CitySheet\city && npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[lang]/city/[citySlug]/page.tsx
git commit -m "feat(ads): add sticky 300x600 sidebar to city page via two-column asymmetric grid"
```

---

## Task 5: Place detail page — top horizontal banner

**Files:**
- Modify: `src/app/[lang]/city/[citySlug]/[placeSlug]/page.tsx`

The place page currently has one `AdsterraSmartFrame` (300×250) mid-page (line ~249). The spec requires a second, horizontal banner at the top of the content view — immediately after the breadcrumb nav and before the hero image.

The existing breadcrumb nav ends at line ~189 (`</nav>`). The article content opens at line ~191 (`<article className="max-w-5xl mx-auto px-6 mt-8">`).

Insert a leaderboard banner **between the nav and the article**:

```tsx
      </nav>

      {/* Top horizontal banner */}
      <div className="max-w-5xl mx-auto px-6 mt-6 flex justify-center" style={{ minHeight: 90 }}>
        <AdsterraSmartFrame
          height={90}
          width={728}
          pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
        />
      </div>

      <article className="max-w-5xl mx-auto px-6 mt-8">
```

> `AdsterraSmartFrame` is already imported in this file — no new import needed.

- [ ] **Step 1: Insert top banner between nav and article**

Find:
```tsx
      </nav>

      <article className="max-w-5xl mx-auto px-6 mt-8">
```

Replace with:
```tsx
      </nav>

      {/* Top horizontal banner */}
      <div className="max-w-5xl mx-auto px-6 mt-6 flex justify-center" style={{ minHeight: 90 }}>
        <AdsterraSmartFrame
          height={90}
          width={728}
          pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
        />
      </div>

      <article className="max-w-5xl mx-auto px-6 mt-8">
```

- [ ] **Step 2: Verify type-check**

Run: `cd D:\Projects\Website\CitySheet\city && npx tsc --noEmit 2>&1`
Expected: zero errors

- [ ] **Step 3: Commit**

```bash
git add src/app/[lang]/city/[citySlug]/[placeSlug]/page.tsx
git commit -m "feat(ads): add top horizontal 728x90 banner to place detail page"
```

---

## Self-Review

**Spec coverage:**
- [x] Modal with `fixed inset-0 bg-zinc-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4` backdrop
- [x] Card: `bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50`
- [x] English text preserved as-is from user's edit
- [x] Debug `setDetected(true)` removed
- [x] User must click X to dismiss (no backdrop click-through dismiss, no auto-close)
- [x] Third home page slot between world map and city grid
- [x] pKey uniqueness documented (Slot 3 placeholder noted)
- [x] `AdsterraSidebarBanner` created for 300×600
- [x] City page: `grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8`
- [x] Sidebar column: `hidden lg:block self-start sticky top-24`
- [x] Place page: top banner immediately after breadcrumb nav
- [x] All ad containers have `minHeight` (CLS prevention)

**Placeholder scan:**
- Task 2 uses literal `"REPLACE_WITH_MEDIUM_RECT_KEY"` — intentional, documented. Developer must substitute before production.

**Type consistency:**
- `AdsterraSidebarBanner` is imported by name in Task 4 Step 1 — matches the named export in Task 3 Step 1.
- `AdsterraSmartFrame` in Task 5 is already imported in `[placeSlug]/page.tsx` at line 18 — no new import required.

---

## One open decision before execution

**Task 2, Slot 3 pKey:** The plan uses placeholder `"REPLACE_WITH_MEDIUM_RECT_KEY"`. Do you want to:
- (a) Use the existing key `258fbd7f9475277565c29c04ed1299f6` for now and swap later
- (b) Leave the placeholder and add the real key before going live

Whichever you choose, confirm before subagent execution so the code is ready for production from day one.
