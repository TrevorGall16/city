/**
 * Global Constants and Design Tokens
 * Following 00_Project_Context and 03_UI specifications
 */

/**
 * DESIGN TOKENS (DETERMINISTIC)
 * These values must match exactly with 00_Project_Context
 */
export const DESIGN_TOKENS = {
  colors: {
    brand: 'indigo-600',
    background: 'slate-50',
    surface: 'white',
    localTextBg: 'amber-50',
    localTextBorder: 'amber-200',
    localTextFg: 'amber-900',
    textMain: 'slate-900',
    textBody: 'slate-600',
    textMuted: 'slate-500',
    border: 'slate-200',
  },

  spacing: {
    pageGutter: 'px-4 md:px-6 lg:px-8',
    section: 'py-12',
    sectionLarge: 'py-16',
    gridGap: 'gap-6',
    cardPadding: 'p-4',
  },

  typography: {
    h1: 'text-4xl md:text-5xl font-bold tracking-tight text-slate-900',
    h2: 'text-2xl md:text-3xl font-bold mb-6 text-slate-900',
    h3: 'text-lg font-semibold leading-tight text-slate-900',
    body: 'text-base leading-relaxed text-slate-600',
    small: 'text-sm font-medium text-slate-500',
    localText: 'font-medium text-amber-900',
  },

  borderRadius: {
    card: 'rounded-xl',
    button: 'rounded-lg',
    input: 'rounded-md',
  },

  shadows: {
    card: 'hover:shadow-lg transition-shadow duration-300',
    sticky: 'shadow-sm',
    dropdown: 'shadow-xl',
  },
} as const

/**
 * ICON SIZES (Lucide React)
 * Following 03_UI section 9.5
 */
export const ICON_SIZES = {
  small: 'w-4 h-4', // 16px
  standard: 'w-5 h-5', // 20px
  large: 'w-6 h-6', // 24px
} as const

/**
 * AD SLOT CONFIGURATION
 * Following 04_Ads_SEO section 2
 */
export const AD_SLOTS = {
  header: {
    id: 'header-slot',
    minHeight: 'min-h-[250px]',
  },
  grid: {
    id: 'in-feed-slot',
    minHeight: 'min-h-[250px]',
  },
  sidebar: {
    id: 'sidebar-sticky',
    minHeight: 'min-h-[600px]',
  },
  footer: {
    id: 'mobile-sticky-footer',
    minHeight: 'min-h-[90px]',
  },
} as const

/**
 * BREAKPOINTS
 * Matches Tailwind default breakpoints
 */
export const BREAKPOINTS = {
  mobile: 640, // sm
  tablet: 768, // md
  desktop: 1024, // lg
} as const

/**
 * PERFORMANCE TARGETS
 * Following 06_Quality_and_Deployment section 7
 */
export const PERFORMANCE_TARGETS = {
  lighthouseMobile: 90,
  lighthouseSEO: 95,
  maxFirstLoadJS: 100, // KB (gzipped)
  maxCLS: 0.03,
  maxLCP: 2.5, // seconds
} as const

/**
 * CONTENT LIMITS
 * Following schema constraints
 */
export const CONTENT_LIMITS = {
  commentMaxLength: 500,
  descriptionMaxLength: 200,
  searchMinLength: 2,
} as const

/**
 * SITE METADATA
 * Base values for SEO
 */
export const SITE_CONFIG = {
  name: 'City Sheet',
  description: 'Your travel cheat sheet - curated recommendations with instant translation',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const

/**
 * ANIMATION TIMINGS
 * Consistent transition durations
 */
export const ANIMATION = {
  fast: 'duration-150',
  normal: 'duration-300',
  slow: 'duration-500',
} as const
