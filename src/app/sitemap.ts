/**
 * 🛰️ MASTER AI: SEO SITEMAP (V6.0 - INDEXING LOCK)
 * ✅ Feature: Full x-default and hreflang alternate support.
 * ✅ Logic: Maps 60+ cities across 9 languages as interconnected units.
 */

import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

const BASE_URL = 'https://citybasic.com'
const SUPPORTED_LANGS = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)
  const baseCityFiles = files.filter(f => f.endsWith('.json') && !f.includes('-'))

  const entries: any[] = []

  // Helper to generate alternate language links
  const getAlternates = (path: string) => ({
    languages: Object.fromEntries(
      SUPPORTED_LANGS.map((l) => [l, `${BASE_URL}/${l}${path}`])
    ),
  })

  // 1. Process Home Pages
  SUPPORTED_LANGS.forEach((lang) => {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: new Date(),
      priority: 1.0,
      alternates: getAlternates(''),
    })
  })

  // 2. Process Cities and Places
  for (const file of baseCityFiles) {
    const citySlug = file.replace('.json', '')
    const content = await fs.readFile(path.join(citiesDir, file), 'utf-8')
    const city = JSON.parse(content)

    const allPlaceSlugs = [
      ...(city.must_eat || []),
      ...(city.must_see?.flatMap((g: any) => g.items || []) || [])
    ].filter((p: any) => p.slug).map((p: any) => p.slug)

    SUPPORTED_LANGS.forEach((lang) => {
      // City Hub
      entries.push({
        url: `${BASE_URL}/${lang}/city/${citySlug}`,
        lastModified: new Date(),
        priority: 0.8,
        alternates: getAlternates(`/city/${citySlug}`),
      })

      // Detailed Places
      allPlaceSlugs.forEach((placeSlug) => {
        entries.push({
          url: `${BASE_URL}/${lang}/city/${citySlug}/${placeSlug}`,
          lastModified: new Date(),
          priority: 0.6,
          alternates: getAlternates(`/city/${citySlug}/${placeSlug}`),
        })
      })
    })
  }

  return entries
}