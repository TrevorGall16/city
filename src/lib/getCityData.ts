import { cache } from 'react'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'

/**
 * Shared city data loader with React cache() for request deduplication.
 *
 * Within a single server request (e.g. generateMetadata + page component),
 * calling getCityData with the same args will only read the file once.
 */
/**
 * Shared city list loader with React cache() for request deduplication.
 * Called by generateMetadata + page component on the homepage.
 */
export const getAllCities = cache(async () => {
  try {
    const citiesDir = path.join(process.cwd(), 'src/data/cities')
    const files = await fs.readdir(citiesDir)
    const cities = await Promise.all(
      files
        .filter(file => file.endsWith('.json') && !/-\w{2}\.json$/.test(file))
        .map(async file => {
          try {
            const filePath = path.join(citiesDir, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const city = JSON.parse(content)
            return {
              name: city.name,
              country: city.country || "Unknown",
              country_code: city.country_code,
              slug: file.replace('.json', ''),
              image: city.hero_image,
              intro_vibe: city.intro_vibe,
              region: city.region || "Other",
              lat: city.lat || 0,
              lng: city.lng || 0
            }
          } catch { return null }
        })
    )
    return cities.filter(c => c !== null) as any[]
  } catch { return [] }
})

export const getCityData = cache(async (slug: string, lang: string): Promise<City | null> => {
  try {
    const fileName = lang === 'en' ? `${slug}.json` : `${slug}-${lang}.json`
    const filePath = path.join(process.cwd(), 'src/data/cities', fileName)
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent) as City
  } catch {
    try {
      // Fallback to English if localized file is missing or corrupt
      const fallbackPath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
      const fallbackContent = await fs.readFile(fallbackPath, 'utf8')
      return JSON.parse(fallbackContent) as City
    } catch {
      return null
    }
  }
})
