export const dynamic = 'force-dynamic';
export const revalidate = 0;
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

  const routes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  cities.forEach((city) => {
    if (!city.slug) return;

    // ✅ FIX: Added /city/ to match your folder structure
    routes.push({
      url: `${BASE_URL}/city/${city.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    })

    // ✅ FIX: Added /city/ to Must Eat
    if (city.must_eat) {
      city.must_eat
        .filter(food => food.slug && food.slug !== 'undefined')
        .forEach((food) => {
          routes.push({
            url: `${BASE_URL}/city/${city.slug}/${food.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        })
    }

    // ✅ FIX: Added /city/ to Must See
    if (city.must_see) {
      const allSights = city.must_see.flatMap((group: any) => group.items || [])
      allSights
        .filter((sight: any) => sight.slug && sight.slug !== 'undefined')
        .forEach((sight: any) => {
          routes.push({
            url: `${BASE_URL}/city/${city.slug}/${sight.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.8,
          })
        })
    }

    // ✅ FIX: Added /city/ to Logistics
    if (city.logistics) {
      city.logistics
        .filter(topic => topic.slug && topic.slug !== 'undefined')
        .forEach((topic) => {
          routes.push({
            url: `${BASE_URL}/city/${city.slug}/${topic.slug}`,
            lastModified: currentDate,
            changeFrequency: 'yearly',
            priority: 0.7,
          })
        })
    }
  })

  return routes
}