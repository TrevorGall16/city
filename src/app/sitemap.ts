import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
export const revalidate = 0; // ✅ This forces the sitemap to be rebuilt on every visit

// ✅ FIX 1: MATCH YOUR CANONICAL DOMAIN (No WWW)
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

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
  ]

  cities.forEach((city) => {
    // ✅ FIX 2: Ensure city slug exists
    if (!city.slug) return;

    routes.push({
      url: `${BASE_URL}/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // ✅ FIX 3: Safety filter for Must Eat
    if (city.must_eat) {
      city.must_eat
        .filter(food => food.slug && food.slug !== 'undefined') // Filter out "undefined"
        .forEach((food) => {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${food.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        })
    }

    // ✅ FIX 4: Safety filter for Must See
    if (city.must_see) {
      const allSights = city.must_see.flatMap((group: any) => group.items || [])
      allSights
        .filter((sight: any) => sight.slug && sight.slug !== 'undefined') // Filter out "undefined"
        .forEach((sight: any) => {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${sight.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        })
    }

    // ✅ FIX 5: Safety filter for Logistics
    if (city.logistics) {
      city.logistics
        .filter(topic => topic.slug && topic.slug !== 'undefined') // Filter out "undefined"
        .forEach((topic) => {
          routes.push({
            url: `${BASE_URL}/${city.slug}/${topic.slug}`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.7,
          })
        })
    }
  })

  return routes
}