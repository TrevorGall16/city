/**
 * Single source of truth for supported locales.
 *
 * Keep ordering stable — sitemap, hreflang, and dictionary fallback rely on it.
 * To add a new locale: append it here, add a matching entry to
 * `src/data/dictionaries.ts` and `src/data/seo-dictionary.ts`, and add per-locale
 * city JSON files under `src/data/cities/`.
 */

export const LOCALES = [
  'en',
  'fr',
  'es',
  'it',
  'ja',
  'hi',
  'de',
  'zh',
  'ar',
] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const isLocale = (value: string): value is Locale =>
  (LOCALES as readonly string[]).includes(value)
