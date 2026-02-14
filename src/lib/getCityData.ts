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
