import fs from 'fs'
import path from 'path'
import { LOCALES, DEFAULT_LOCALE } from '@/data/locales'

/**
 * Returns the list of language codes that have a city JSON file on disk.
 * English is always included (it's the default/fallback).
 */
export function getAvailableLanguages(citySlug: string): string[] {
  const dir = path.join(process.cwd(), 'src/data/cities')

  return LOCALES.filter((lang) => {
    if (lang === DEFAULT_LOCALE) return true // English always exists as {slug}.json
    const filePath = path.join(dir, `${citySlug}-${lang}.json`)
    return fs.existsSync(filePath)
  })
}
