import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'

// ✅ 1. Define Base URL (Non-WWW)
const BASE_URL = 'https://citybasic.com'

async function getCities(): Promise<City[]> {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)
  
  const cities = await Promise.all(
    files
      .filter(file => file.endsWith('.json'))
      .map(async file => {
        const content = await fs.readFile(path.join(citiesDir, file), 'utf-8')
        return JSON.parse(content)
      })
  )
  
  return cities
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cities = await getCities()
  const currentDate = new Date().toISOString().split('T')[0]

  // 1. Static Routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  // 2. Dynamic City Routes
  cities.forEach((city) => {
    // A. Main City Page
    routes.push({
      url: `${BASE_URL}/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // B. Must Eat Items
    if (city.must_eat) {
      city.must_eat.forEach((food) => {
        if (food.slug) {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${food.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        }
      })
    }

    // C. Must See Items (✅ THE FIX: Flatten the groups!)
    if (city.must_see) {
      // 1. Flatten the groups into a single list of places
      const allSights = city.must_see.flatMap((group: any) => group.items || [])
      
      // 2. Loop through the actual places, NOT the groups
      allSights.forEach((sight: any) => {
        if (sight.slug) {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${sight.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        }
      })
    }

    // D. Logistics Pages
    if (city.logistics) {
      city.logistics.forEach((topic) => {
        if (topic.slug) {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${topic.slug}`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.7,
          })
        }
      })
    }
  })

  return routes
}