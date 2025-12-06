# FINAL TECHNICAL DOCUMENTATION

## Project Overview

**City Sheet** is a cultural encyclopedia travel application built with Next.js 14+, designed to help international travelers navigate foreign cities with curated cultural insights, neighborhood guides, and instant translation features.

### Core Philosophy

This is **NOT** a business directory. It's a **cultural encyclopedia** that teaches travelers about:
- Cultural staples (e.g., "The Butter Croissant") rather than specific businesses (e.g., "Pierre Hermé")
- Neighborhood vibes and characteristics
- Month-by-month weather planning
- Local etiquette and essential phrases

---

## 1. Project Structure

```
/home/user/city/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Homepage (city grid)
│   │   ├── layout.tsx                # Root layout (header/footer)
│   │   ├── globals.css               # Global styles + Tailwind
│   │   ├── city/[citySlug]/
│   │   │   ├── page.tsx              # City sheet (SSG)
│   │   │   └── [placeSlug]/page.tsx  # Place detail (SSG)
│   │   ├── api/
│   │   │   ├── comments/route.ts     # Comment CRUD
│   │   │   └── votes/route.ts        # Voting system
│   │   └── auth/callback/route.ts    # OAuth callback
│   │
│   ├── components/
│   │   ├── features/                 # Business logic components
│   │   │   ├── TranslationHook.tsx   # 🔥 CORE FEATURE - Copy local text
│   │   │   ├── MonthCard.tsx         # Weather breakdown card
│   │   │   ├── NeighborhoodCard.tsx  # Neighborhood vibe card
│   │   │   ├── PlaceCard.tsx         # Place grid card
│   │   │   ├── CityCard.tsx          # Homepage city card
│   │   │   └── CommentThread.tsx     # Social layer
│   │   ├── ui/                       # Reusable UI primitives
│   │   │   ├── Button.tsx            # Variant-based button
│   │   │   ├── LoginModal.tsx        # Auth modal
│   │   │   └── SectionHeader.tsx     # Flag-themed headers
│   │   ├── ads/
│   │   │   ├── AdContainer.tsx       # CLS-safe ad slots
│   │   │   └── AdProvider.tsx        # Ad management context
│   │   └── providers/
│   │       └── AuthProvider.tsx      # Supabase auth context
│   │
│   ├── data/
│   │   ├── cities/
│   │   │   └── paris.json            # 🗂️ SINGLE SOURCE OF TRUTH
│   │   └── taxonomy.ts               # Category definitions
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   └── server.ts             # Server client (cookies)
│   │   ├── utils.ts                  # cn(), formatDate(), slugify()
│   │   └── constants.ts              # Design tokens, ad slots
│   │
│   ├── hooks/
│   │   └── useAnalytics.ts           # GA4-ready event tracking
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   │
│   └── middleware.ts                 # Session refresh
│
├── scripts/
│   ├── validate-data.js              # Zod validation (prebuild)
│   └── generate-sitemap.js           # XML sitemap generator
│
├── supabase/
│   └── schema.sql                    # Database schema + RLS
│
├── public/
│   └── sitemap.xml                   # Generated sitemap
│
├── .env.local                        # Supabase credentials
├── package.json                      # Dependencies + scripts
├── next.config.js                    # Next.js config (ISR, images)
├── tailwind.config.ts                # Tailwind customization
└── tsconfig.json                     # TypeScript config
```

---

## 2. Data Flow Architecture

### 2.1 The Single Source of Truth: `paris.json`

**Location**: `src/data/cities/paris.json`

This JSON file powers the **entire application** through Next.js Static Site Generation (SSG).

**Structure**:
```json
{
  "id": "city-001",
  "slug": "paris",
  "country_code": "fr",
  "general_info": { ... },
  "stats": { ... },
  "weather_breakdown": [ ... ],    // 12 months
  "culture": { ... },
  "neighborhoods": [ ... ],
  "logistics": { ... },
  "must_eat": [ ... ],              // Cultural staples
  "must_see": [ ... ]               // Specific locations
}
```

### 2.2 SSG Pipeline

**Step 1: Build-time validation** (`scripts/validate-data.js`)
```bash
npm run prebuild → Zod validation
```
- Validates all JSON files against TypeScript schemas
- Fails build if data is malformed
- Checks for duplicate slugs, invalid geo coordinates

**Step 2: Static params generation** (`generateStaticParams()`)

```typescript
// src/app/city/[citySlug]/page.tsx
export async function generateStaticParams() {
  const files = await fs.readdir('src/data/cities')
  return files.map(file => ({ citySlug: file.replace('.json', '') }))
}
// Output: [{ citySlug: 'paris' }]
```

```typescript
// src/app/city/[citySlug]/[placeSlug]/page.tsx
export async function generateStaticParams() {
  // Read paris.json
  // Extract all places from must_eat + must_see
  return [
    { citySlug: 'paris', placeSlug: 'butter-croissant' },
    { citySlug: 'paris', placeSlug: 'musee-rodin' },
    // ... 11 total places
  ]
}
// Output: 12 static pages
```

**Step 3: Build execution**
```bash
npm run build
→ validate-data.js (fail fast)
→ generate-sitemap.js (14 URLs)
→ next build (18 static pages)
```

**Generated pages**:
- `/ ` (homepage)
- `/city/paris` (city sheet)
- `/city/paris/butter-croissant` (place detail × 12)

### 2.3 Data Access Pattern

```typescript
// Every page uses this helper
async function getCityData(slug: string): Promise<City | null> {
  const filePath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
  const fileContent = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(fileContent)
}
```

**Why this works**:
- Files are read at **build time** (not runtime)
- Pages are pre-rendered as static HTML
- No database queries on page load
- Perfect SEO (fully indexable HTML)

---

## 3. Key Systems

### 3.1 Translation Hook (THE NORTH STAR FEATURE)

**Location**: `src/components/features/TranslationHook.tsx`

**Purpose**: Copy local text to clipboard for ordering/navigation

```typescript
export function TranslationHook({ text, placeName }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    trackCopyLocal(text, placeName)  // 📊 North Star Metric
    setCopied(true)
  }

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy Local Name'}
    </button>
  )
}
```

**Integration points**:
- `PlaceCard.tsx`: Shows hook if `name_local !== name_en`
- `Place detail page`: Prominent hook below title
- Analytics: Tracks `copy_name_local` event (conversion metric)

**Why it matters**:
- Core value proposition for travelers
- Removes language barrier for ordering food
- Tracked as primary success metric

### 3.2 Ad Injection Logic

**Problem**: Inject ads without breaking grid layouts or causing CLS (Cumulative Layout Shift)

**Solution**: Fixed-height placeholders with programmatic injection

#### Component: `AdContainer.tsx`

```typescript
export function AdContainer({ slot }: { slot: 'header' | 'grid' | 'sidebar' }) {
  const minHeights = {
    header: 'min-h-[90px]',
    grid: 'min-h-[250px]',
    sidebar: 'min-h-[600px]',
  }

  return (
    <div className={`bg-slate-100 ${minHeights[slot]}`}>
      {/* Ad script loads here */}
    </div>
  )
}
```

**Key principles**:
1. **Fixed min-height**: Prevents layout shift when ad loads
2. **Neutral background**: `bg-slate-100` (looks intentional, not broken)
3. **Semantic slots**: Named by location (header/grid/sidebar)

#### Ad Injection in Grids

**Location**: `src/app/city/[citySlug]/page.tsx`

```typescript
const renderPlacesWithAds = (places: Place[], category: string) => {
  const elements: React.ReactNode[] = []

  places.forEach((place, index) => {
    elements.push(<PlaceCard key={place.id} place={place} />)

    // Inject ad AFTER 6th item
    if (index === 5 && places.length > 6) {
      elements.push(
        <div key={`ad-${category}-${index}`} className="col-span-full">
          <AdContainer slot="grid" />
        </div>
      )
    }
  })
  return elements
}
```

**Why index === 5**:
- Arrays are 0-indexed
- After 6th item = index 5
- `col-span-full` makes ad span entire grid width

#### Ad Provider Context

**Location**: `src/components/ads/AdProvider.tsx`

```typescript
export function AdProvider({ children }) {
  useEffect(() => {
    const handleRouteChange = debounce(() => {
      // Refresh ads on route change
      window.adRefresh?.()
    }, 30000) // 30s throttle

    window.addEventListener('routeChange', handleRouteChange)
  }, [])

  return <>{children}</>
}
```

**Features**:
- Route change detection (SPA navigation)
- 30-second throttle (prevent ad spam)
- Mock consent management (GDPR-ready)

### 3.3 Supabase Integration

#### Database Schema (`supabase/schema.sql`)

```sql
-- Profiles (auto-created on OAuth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments (city or place-specific)
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  city_slug TEXT NOT NULL,
  place_slug TEXT,              -- NULL for city-level comments
  parent_id UUID REFERENCES comments(id),  -- For threading
  content TEXT NOT NULL CHECK (length(content) <= 500),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes (upvote/downvote)
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  comment_id UUID REFERENCES comments(id),
  value INTEGER CHECK (value IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, comment_id)   -- One vote per user per comment
);
```

#### Row Level Security (RLS)

```sql
-- Read: Anyone can read
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON comments FOR SELECT USING (true);

-- Write: Must be authenticated
CREATE POLICY "Auth write" ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Delete: Own comments only
CREATE POLICY "Own delete" ON comments FOR DELETE
  USING (auth.uid() = user_id);
```

#### Atomic Vote Upsert

**Problem**: Race conditions on concurrent votes

**Solution**: PostgreSQL function with UPSERT

```sql
CREATE OR REPLACE FUNCTION upsert_vote(
  p_user_id UUID,
  p_comment_id UUID,
  p_value INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO votes (user_id, comment_id, value)
  VALUES (p_user_id, p_comment_id, p_value)
  ON CONFLICT (user_id, comment_id)
  DO UPDATE SET value = p_value, created_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

**Usage**: `src/app/api/votes/route.ts`

```typescript
await supabase.rpc('upsert_vote', {
  p_user_id: user.id,
  p_comment_id: commentId,
  p_value: value
})
```

#### Authentication Flow

1. **Client-side trigger**: `LoginModal.tsx`
   ```typescript
   const handleGoogleLogin = async () => {
     await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: { redirectTo: `${origin}/auth/callback` }
     })
   }
   ```

2. **OAuth callback**: `src/app/auth/callback/route.ts`
   ```typescript
   const code = requestUrl.searchParams.get('code')
   await supabase.auth.exchangeCodeForSession(code)
   return NextResponse.redirect(new URL('/', requestUrl.origin))
   ```

3. **Session middleware**: `src/middleware.ts`
   ```typescript
   export async function middleware(request: NextRequest) {
     const supabase = createServerClient(...)
     await supabase.auth.getSession()  // Refresh session
     return response
   }
   ```

#### Comment Thread Component

**Location**: `src/components/features/CommentThread.tsx`

**Features**:
- Load More pagination (NOT infinite scroll)
- Optimistic UI updates
- Vote count aggregation
- Real-time auth state

```typescript
const [comments, setComments] = useState<Comment[]>([])
const [page, setPage] = useState(1)
const COMMENTS_PER_PAGE = 10

const loadComments = async () => {
  const offset = (page - 1) * COMMENTS_PER_PAGE
  const { data } = await fetch(
    `/api/comments?citySlug=${citySlug}&offset=${offset}&limit=${COMMENTS_PER_PAGE}`
  )
  setComments(prev => [...prev, ...data])
}
```

**Why "Load More" not infinite scroll**:
- Better UX for returning to previous position
- Prevents performance issues with large lists
- Explicit user action (no surprises)
- SEO-friendly (all content accessible)

---

## 4. Styling Strategy

### 4.1 Flag Theme System

**Concept**: Use country flag colors as brand accents throughout the UI

**Implementation**: `src/components/ui/SectionHeader.tsx`

```typescript
const FLAG_GRADIENTS: Record<string, string> = {
  fr: 'from-blue-600 via-white to-red-600',  // France
  // es: 'from-red-600 via-yellow-400 to-red-600',  // Spain (future)
  // it: 'from-green-600 via-white to-red-600',  // Italy (future)
}

export function SectionHeader({ title, countryCode }) {
  const gradient = FLAG_GRADIENTS[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'

  return (
    <div className="flex items-center gap-4">
      <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${gradient}`} />
      <h2>{title}</h2>
    </div>
  )
}
```

**Where it appears**:
1. **Hero section**: 1px top border with flag gradient
2. **Section headers**: Thick left border on all sections
3. **Future**: Could extend to buttons, badges, cards

**Why this works**:
- Subtle visual identity per city
- Reinforces "cultural encyclopedia" positioning
- Scalable to any country
- Accessible (not relying on color alone for meaning)

### 4.2 Tailwind Configuration

**Location**: `tailwind.config.ts`

```typescript
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Using Tailwind defaults (slate, indigo)
        // No custom colors (maintainability)
      },
      maxWidth: {
        // Custom breakpoint for encyclopedia layout
        '1600px': '1600px',
      },
    },
  },
}
```

**Design tokens** (`src/lib/constants.ts`):

```typescript
export const DESIGN_TOKENS = {
  colors: {
    brand: {
      primary: 'indigo-600',
      hover: 'indigo-700',
    },
    text: {
      primary: 'slate-900',
      secondary: 'slate-600',
      muted: 'slate-500',
    },
  },
  spacing: {
    section: 'py-12',
    container: 'max-w-[1600px] mx-auto px-4 md:px-8',
  },
}
```

**Why we chose this approach**:
- **Deterministic**: All colors from Tailwind palette
- **No magic numbers**: Everything named via constants
- **Widened layout**: `max-w-[1600px]` for encyclopedia feel (vs. narrow blog)
- **Responsive padding**: `px-4 md:px-8` (mobile-first)

### 4.3 Global Styles

**Location**: `src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-slate-50 text-slate-900;
  }
}

@layer utilities {
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

**Conventions**:
- `@layer base`: Global element styles
- `@layer utilities`: Reusable utility classes
- No custom CSS outside Tailwind (maintainability)

### 4.4 Hydration Fix

**Problem**: Browser translation extensions modify DOM before React loads → Hydration error

**Solution**: `suppressHydrationWarning` in `layout.tsx`

```typescript
<html lang="en" suppressHydrationWarning>
```

**Why this is safe**:
- Only suppresses warnings, doesn't break functionality
- Needed for production (Google Translate, etc.)
- Scoped to `<html>` tag only

---

## 5. Content Strategy

### 5.1 Generic Staples vs. Specific Locations

**Rule**: `is_generic_staple` determines UI behavior

```json
// GENERIC STAPLE (no address)
{
  "id": "food-001",
  "slug": "butter-croissant",
  "name_en": "The Butter Croissant",
  "name_local": "Croissant au Beurre",
  "is_generic_staple": true,
  // NO geo property
  "description": "Educational content about the tradition..."
}

// SPECIFIC LOCATION (has address)
{
  "id": "sight-001",
  "slug": "musee-rodin",
  "name_en": "Musée Rodin",
  "is_generic_staple": false,
  "geo": { "lat": 48.8553, "lng": 2.3159 }
}
```

**Conditional UI** (`src/app/city/[citySlug]/[placeSlug]/page.tsx`):

```typescript
const isGenericStaple = place.is_generic_staple
const showLocationSection = !isGenericStaple && place.geo

return (
  <>
    {isGenericStaple && (
      <div className="bg-amber-50 border border-amber-200">
        This is a cultural tradition, not a specific location.
        Check Community Tips for recommendations!
      </div>
    )}

    {showLocationSection && place.geo && (
      <div>
        <MapPin /> Coordinates: {place.geo.lat}, {place.geo.lng}
        <a href={`https://google.com/maps?q=${place.geo.lat},${place.geo.lng}`}>
          Open in Google Maps
        </a>
      </div>
    )}
  </>
)
```

**Why this matters**:
- Clear separation between education vs. navigation
- Users know when to expect specific addresses
- Comments guide users to specific shops/restaurants

### 5.2 Section Ordering (Final)

```
1. Hero (flag gradient + map pattern)
2. General Info + Quick Stats
3. Weather Deep Dive (12-month scroll)
4. Neighborhoods (vibe grid)
5. Culture & Etiquette (golden rules + phrases)
6. Must See (landmarks with maps)
7. Must Eat (cultural staples, no maps)
8. Logistics (safety/transit - bottom)
```

**Rationale**:
- **Weather first**: Trip planning starts here
- **Neighborhoods next**: Context before specific recommendations
- **Culture before places**: Understand customs before exploring
- **Logistics last**: Reference material (not primary content)

---

## 6. Build & Deployment

### 6.1 Build Scripts

**Location**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run generate:sitemap && next build",
    "prebuild": "npm run validate",
    "validate": "node scripts/validate-data.js",
    "generate:sitemap": "node scripts/generate-sitemap.js"
  }
}
```

**Execution order**:
```
npm run build
  ↓
1. prebuild → validate (Zod schemas)
2. generate:sitemap → public/sitemap.xml
3. next build → .next/ static files
```

**Fail-fast strategy**:
- Validation errors → Build stops immediately
- No broken data reaches production
- CI/CD friendly (exit code 1 on failure)

### 6.2 Sitemap Generation

**Location**: `scripts/generate-sitemap.js`

```javascript
const cities = fs.readdirSync('src/data/cities')
const urls = []

cities.forEach(cityFile => {
  const city = JSON.parse(fs.readFileSync(cityFile))

  // City page
  urls.push({ loc: `/city/${city.slug}`, priority: 0.9 })

  // All place pages
  const places = [...city.must_eat, ...city.must_see]
  places.forEach(place => {
    urls.push({ loc: `/city/${city.slug}/${place.slug}`, priority: 0.8 })
  })
})

// Generate XML
const xml = generateSitemapXML(urls)
fs.writeFileSync('public/sitemap.xml', xml)
```

**Output** (`public/sitemap.xml`):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://citysheet.com/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://citysheet.com/city/paris</loc>
    <priority>0.9</priority>
  </url>
  <!-- ... 12 place pages -->
</urlset>
```

### 6.3 Environment Variables

**Location**: `.env.local` (gitignored)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**Why `NEXT_PUBLIC_`**:
- Exposed to browser (needed for client-side Supabase)
- Safe because anon key has RLS protection
- Server-only secrets (if needed) omit `NEXT_PUBLIC_`

### 6.4 Next.js Configuration

**Location**: `next.config.js`

```javascript
module.exports = {
  images: {
    dangerouslyAllowSVG: true,  // For placehold.co
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' }
    ],
  },

  // ISR Cache Headers
  async headers() {
    return [{
      source: '/city/:path*',
      headers: [{
        key: 'Cache-Control',
        value: 'public, s-maxage=604800, stale-while-revalidate=86400'
      }]
    }]
  },
}
```

**ISR Strategy**:
- `s-maxage=604800`: CDN caches for 7 days
- `stale-while-revalidate=86400`: Serve stale for 24h while revalidating
- Pages update weekly without full rebuild

---

## 7. Analytics & Metrics

### 7.1 Tracked Events

**Location**: `src/hooks/useAnalytics.ts`

```typescript
export function useAnalytics() {
  return {
    // 1. User searches for a city
    trackSearch: (query: string) => {
      console.log('[Analytics] search_performed', { query })
    },

    // 2. User opens a place detail page
    trackPlaceOpen: (placeName: string, citySlug: string, placeSlug: string) => {
      console.log('[Analytics] place_opened', { placeName, citySlug, placeSlug })
    },

    // 3. 🎯 NORTH STAR: User copies local name
    trackCopyLocal: (text: string, placeName: string) => {
      console.log('[Analytics] copy_name_local', { text, placeName })
    },

    // 4. User posts a comment
    trackCommentPost: (citySlug: string, placeSlug?: string) => {
      console.log('[Analytics] comment_posted', { citySlug, placeSlug })
    },

    // 5. User votes on a comment
    trackVote: (value: number, commentId: string) => {
      console.log('[Analytics] vote_clicked', { value, commentId })
    },
  }
}
```

**Current implementation**: Console logging (V1)

**Production migration** (V2):
```typescript
// Replace console.log with GA4
trackCopyLocal: (text, placeName) => {
  window.gtag?.('event', 'copy_name_local', {
    text,
    placeName,
    timestamp: Date.now()
  })
}
```

**North Star Metric**: `copy_name_local`
- Measures core value delivery
- Indicates successful translation bridge
- Conversion funnel: View → Copy → Success

### 7.2 Performance Metrics

**Target metrics**:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

**Optimizations**:
1. **SSG**: Pre-rendered HTML (instant LCP)
2. **Fixed ad heights**: Prevents CLS
3. **Image optimization**: Next.js `<Image>` component
4. **Font optimization**: `next/font/google` (self-hosted)

---

## 8. Best Practices & Conventions

### 8.1 TypeScript Strict Mode

**Location**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Why strict**:
- Catch errors at compile time
- Self-documenting code (types as documentation)
- Refactoring safety (rename, move, delete)

### 8.2 Component Patterns

**Naming convention**:
- **PascalCase** for components: `TranslationHook.tsx`
- **camelCase** for utilities: `utils.ts`
- **kebab-case** for URLs: `/city/paris/butter-croissant`

**File organization**:
```
components/
├── features/      # Business logic (TranslationHook, MonthCard)
├── ui/            # Primitives (Button, Modal, SectionHeader)
├── ads/           # Ad system (AdContainer, AdProvider)
└── providers/     # Context providers (AuthProvider)
```

**Component structure**:
```typescript
// 1. Imports
import { useState } from 'react'

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
export function ComponentName({ prop }: Props) {
  // Hooks first
  const [state, setState] = useState()

  // Event handlers
  const handleClick = () => { }

  // Render
  return <div>...</div>
}
```

### 8.3 Data Validation

**Principle**: Validate at boundaries (file read, API input)

**Implementation**: Zod schemas mirror TypeScript types

```typescript
// src/types/index.ts
export interface City {
  id: string
  slug: string
  name: string
}

// scripts/validate-data.js
const CitySchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1)
})
```

**Why both**:
- **TypeScript**: Compile-time safety
- **Zod**: Runtime validation (user data)
- **DRY violation acceptable**: Different purposes

### 8.4 Error Handling

**Pattern**: Fail gracefully with user-friendly messages

```typescript
// API routes
export async function POST(request: Request) {
  try {
    const body = await request.json()
    // ... logic
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Comment creation failed:', error)
    return NextResponse.json(
      { error: 'Failed to post comment. Please try again.' },
      { status: 500 }
    )
  }
}
```

**Logging strategy**:
- `console.error()` for server errors (caught by monitoring)
- User-facing messages (no stack traces)
- Context in logs (user ID, resource ID)

---

## 9. Future Expansion

### 9.1 Adding New Cities

**Steps**:
1. Create `src/data/cities/{city-slug}.json`
2. Follow Paris structure exactly
3. Run `npm run validate` (Zod checks)
4. Run `npm run build` (generates pages + sitemap)

**Auto-scaling**:
- No code changes needed
- `generateStaticParams()` automatically includes new cities
- Sitemap auto-updates

### 9.2 Adding New Countries

**Steps**:
1. Add flag gradient to `SectionHeader.tsx`:
   ```typescript
   const FLAG_GRADIENTS = {
     fr: 'from-blue-600 via-white to-red-600',
     es: 'from-red-600 via-yellow-400 to-red-600',  // Spain
   }
   ```

2. Update city JSON with `country_code: "es"`

3. Flag theme automatically applies

### 9.3 Feature Flags

**Future pattern** (not implemented yet):

```typescript
// src/lib/feature-flags.ts
export const FEATURES = {
  COMMENTING: process.env.NEXT_PUBLIC_ENABLE_COMMENTS === 'true',
  WEATHER_WIDGET: process.env.NEXT_PUBLIC_ENABLE_WEATHER === 'true',
}

// Usage
{FEATURES.COMMENTING && <CommentThread />}
```

**Why we'll need this**:
- Gradual rollouts
- A/B testing
- Emergency shutoffs (disable comments if spam)

---

## 10. Common Pitfalls & Solutions

### 10.1 Async Params (Next.js 15+)

**Error**: `params` accessed without `await`

```typescript
// ❌ WRONG
export default async function Page({ params }) {
  const city = await getCityData(params.citySlug)  // Error!
}

// ✅ CORRECT
export default async function Page({ params }) {
  const { citySlug } = await params
  const city = await getCityData(citySlug)
}
```

**Why**: Next.js 15+ made `params` a Promise for streaming support

### 10.2 Hydration Mismatch

**Symptom**: "Text content does not match server-rendered HTML"

**Cause**: Browser extensions modify DOM before React hydrates

**Solution**: `suppressHydrationWarning` on `<html>` tag

```typescript
<html lang="en" suppressHydrationWarning>
```

### 10.3 Stale Static Pages

**Problem**: Content updated but page not regenerating

**Solution**: ISR (Incremental Static Regeneration)

```typescript
// Option 1: Time-based (7 days)
export const revalidate = 604800

// Option 2: On-demand (API route)
await res.revalidate('/city/paris')
```

### 10.4 TypeScript Errors on Build

**Symptom**: Build fails with type errors not shown in dev

**Solution**: Run type-check locally

```bash
npx tsc --noEmit
```

**Prevention**: Add to CI pipeline

```yaml
# .github/workflows/ci.yml
- run: npm run validate
- run: npx tsc --noEmit
- run: npm run build
```

---

## 11. Performance Checklist

### Before Launch

- [ ] **Images**: All using Next.js `<Image>` component
- [ ] **Fonts**: Using `next/font/google` (self-hosted)
- [ ] **Bundle size**: Check with `npm run build` (look for red warnings)
- [ ] **Lighthouse score**: > 90 on all metrics
- [ ] **Accessibility**: Keyboard navigation works
- [ ] **Mobile**: Test on real devices (not just DevTools)
- [ ] **Sitemap**: Verify `public/sitemap.xml` has all pages
- [ ] **Analytics**: Confirm events firing (check console in dev)
- [ ] **Supabase RLS**: Test logged-out users can't write
- [ ] **Error boundaries**: Test 404, 500, API failures

### Monitoring

- [ ] **Sentry** (or similar): Track runtime errors
- [ ] **Vercel Analytics**: Track Web Vitals
- [ ] **Google Analytics**: Track user flows
- [ ] **Supabase Dashboard**: Monitor API usage
- [ ] **Uptime monitoring**: Check /city/paris every 5 minutes

---

## 12. Quick Reference

### File Extensions

- `.tsx` - React components with TypeScript
- `.ts` - TypeScript utilities (no JSX)
- `.js` - Build scripts (Node.js)
- `.sql` - Database migrations
- `.css` - Global styles (only `globals.css`)

### Import Aliases

```typescript
import { City } from '@/types'         // → src/types
import { Button } from '@/components'  // → src/components
import { cn } from '@/lib/utils'       // → src/lib
```

### Common Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run validate     # Check data integrity
npm run generate:sitemap  # Generate sitemap.xml
npx tsc --noEmit     # Type check without building
```

### Environment Setup

```bash
# 1. Clone repo
git clone [repo-url]

# 2. Install dependencies
npm install

# 3. Set up Supabase
cp .env.example .env.local
# Add your Supabase credentials

# 4. Run dev server
npm run dev
```

---

## 13. Architecture Decisions (ADR)

### Why Next.js App Router?

**Decision**: Use App Router (not Pages Router)

**Reasoning**:
- Server Components by default (better performance)
- Streaming & Suspense support
- Simpler data fetching (`async` components)
- Future-proof (Pages Router in maintenance mode)

### Why SSG over SSR?

**Decision**: Pre-render all pages at build time

**Reasoning**:
- Content rarely changes (travel guides)
- Perfect SEO (fully rendered HTML)
- Cheapest hosting (static files)
- Fastest possible page loads

**Trade-off**: Comments are client-side fetched (acceptable for social layer)

### Why Supabase over Custom Backend?

**Decision**: Supabase for auth + database

**Reasoning**:
- **RLS**: Security at database level (can't bypass)
- **Real-time**: Free WebSocket subscriptions
- **Auth**: Google OAuth out-of-box
- **Postgres**: Full SQL when needed
- **Cost**: Free tier generous (50K monthly users)

**Trade-off**: Vendor lock-in (mitigated by Postgres compatibility)

### Why Single JSON File?

**Decision**: One `paris.json` powers entire city

**Reasoning**:
- **Simplicity**: One source of truth
- **Validation**: Single Zod schema
- **Git-friendly**: Easy to review changes
- **Performance**: Read once at build time

**Trade-off**: Large files (mitigated by SSG + gzip)

### Why No CMS?

**Decision**: JSON files in Git (not Contentful/Sanity)

**Reasoning**:
- **Version control**: Full history in Git
- **No vendor**: Can't lose access
- **Type safety**: Zod validation
- **Free**: No CMS subscription

**Trade-off**: Non-technical editors need developer help

---

## Conclusion

This codebase follows the **Encyclopedia pattern**:
- Educational content over business listings
- Cultural context before specific recommendations
- Translation bridge as core value
- Community knowledge sharing

**Key principles**:
1. **Type safety**: TypeScript + Zod everywhere
2. **Static-first**: SSG unless dynamic required
3. **Fail fast**: Validate at build time
4. **Semantic HTML**: Accessibility first
5. **Progressive enhancement**: Works without JS

**Next steps for developers**:
1. Read this doc end-to-end
2. Run `npm run dev` and explore
3. Read `src/types/index.ts` (the schema)
4. Trace data flow: `paris.json` → `generateStaticParams()` → page
5. Make a small change and run `npm run build`

**Questions? Check**:
- This doc (search for keywords)
- TypeScript errors (they're usually right)
- Zod validation output (specific error messages)
- Next.js docs for App Router patterns
