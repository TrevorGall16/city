import { promises as fs } from 'fs'
import path from 'path'
import { cache } from 'react'
import { LOCALES } from '@/data/locales'

const CITIES_DIR = path.join(process.cwd(), 'src/data/cities')

const isBaseFile = (file: string) =>
  file.endsWith('.json') && !/-\w{2}\.json$/.test(file)

export const getAllCitySlugs = cache(async (): Promise<string[]> => {
  const files = await fs.readdir(CITIES_DIR)
  return files.filter(isBaseFile).map((f) => f.replace('.json', ''))
})

export const readCityBase = cache(async (slug: string): Promise<any | null> => {
  try {
    const raw = await fs.readFile(
      path.join(CITIES_DIR, `${slug}.json`),
      'utf-8'
    )
    return JSON.parse(raw)
  } catch {
    return null
  }
})

function cityHasContent(city: any): boolean {
  if (!city) return false
  const mustSeeCount = (city.must_see ?? []).reduce(
    (acc: number, g: any) => acc + (g?.items?.length ?? 0),
    0
  )
  const mustEatCount = Array.isArray(city.must_eat) ? city.must_eat.length : 0
  return mustSeeCount + mustEatCount > 0
}

export async function langCityParams() {
  const slugs = await getAllCitySlugs()
  const params: Array<{ lang: string; citySlug: string }> = []
  for (const citySlug of slugs) {
    const city = await readCityBase(citySlug)
    if (!cityHasContent(city)) continue
    for (const lang of LOCALES) {
      params.push({ lang, citySlug })
    }
  }
  return params
}

export async function langCityPlaceParams() {
  const slugs = await getAllCitySlugs()
  const params: Array<{ lang: string; citySlug: string; placeSlug: string }> =
    []
  for (const citySlug of slugs) {
    const city = await readCityBase(citySlug)
    if (!city) continue
    const placeSlugs = new Set<string>()
    for (const group of city.must_see ?? []) {
      for (const item of group.items ?? []) {
        if (item?.slug) placeSlugs.add(item.slug)
      }
    }
    for (const item of city.must_eat ?? []) {
      if (item?.slug) placeSlugs.add(item.slug)
    }
    for (const placeSlug of placeSlugs) {
      for (const lang of LOCALES) {
        params.push({ lang, citySlug, placeSlug })
      }
    }
  }
  return params
}

const CATEGORY_FIELD: Record<string, string> = {
  food: 'must_eat',
  sights: 'must_see',
  coffee: 'best_coffee',
  bakeries: 'best_bakeries',
  stay: 'where_to_stay',
  'cheap-eats': 'cheap_eats',
}

function hasCategoryData(city: any, category: string): boolean {
  const field = CATEGORY_FIELD[category]
  if (!field) return false
  const value = city?.[field]
  if (!Array.isArray(value) || value.length === 0) return false
  if (category === 'sights') {
    return value.some(
      (group: any) => Array.isArray(group?.items) && group.items.length > 0
    )
  }
  return true
}

export async function langCityCategoryParams() {
  const slugs = await getAllCitySlugs()
  const params: Array<{ lang: string; citySlug: string; category: string }> =
    []
  for (const citySlug of slugs) {
    const city = await readCityBase(citySlug)
    if (!city) continue
    for (const category of Object.keys(CATEGORY_FIELD)) {
      if (!hasCategoryData(city, category)) continue
      for (const lang of LOCALES) {
        params.push({ lang, citySlug, category })
      }
    }
  }
  return params
}

export async function langCityItineraryParams() {
  const slugs = await getAllCitySlugs()
  const durations = ['1-day', '2-days', '3-days']
  const params: Array<{ lang: string; citySlug: string; duration: string }> =
    []
  for (const citySlug of slugs) {
    const city = await readCityBase(citySlug)
    if (!city) continue
    const mustSeeCount = (city.must_see ?? []).reduce(
      (acc: number, g: any) => acc + (g?.items?.length ?? 0),
      0
    )
    const mustEatCount = (city.must_eat ?? []).length
    if (mustSeeCount + mustEatCount === 0) continue
    for (const duration of durations) {
      for (const lang of LOCALES) {
        params.push({ lang, citySlug, duration })
      }
    }
  }
  return params
}

export async function langCityInfoParams() {
  const slugs = await getAllCitySlugs()
  const params: Array<{ lang: string; citySlug: string; topicSlug: string }> =
    []
  for (const citySlug of slugs) {
    const city = await readCityBase(citySlug)
    if (!city) continue
    const topics = Array.isArray(city.logistics)
      ? city.logistics
      : city.logistics && typeof city.logistics === 'object'
      ? [city.logistics]
      : []
    for (const topic of topics) {
      if (!topic?.slug) continue
      for (const lang of LOCALES) {
        params.push({ lang, citySlug, topicSlug: topic.slug })
      }
    }
  }
  return params
}

export { CATEGORY_FIELD, hasCategoryData }
