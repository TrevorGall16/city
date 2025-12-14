import { MetadataRoute } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

// ⚠️ CHANGE THIS to your actual domain when you deploy (e.g., https://citysheet.vercel.app)
const BASE_URL = 'https://citysheet.com' 

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static Routes
  const routes = [
    '',
    '/profile',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // 2. Dynamic City & Place Routes
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)
  
  let dynamicRoutes: MetadataRoute.Sitemap = []

  for (const file of files) {
    if (!file.endsWith('.json')) continue
    
    // Read city data
    const filePath = path.join(citiesDir, file)
    const content = await fs.readFile(filePath, 'utf-8')
    const city = JSON.parse(content)
    
    // Add City Page
    dynamicRoutes.push({
      url: `${BASE_URL}/city/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    // Add Place Pages
    // Combine must_see (nested arrays) and must_eat
    const mustSeeItems = city.must_see.flatMap((g: any) => g.items)
    const places = [...mustSeeItems, ...city.must_eat]
    
    for (const place of places) {
      dynamicRoutes.push({
        url: `${BASE_URL}/city/${city.slug}/${place.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  return [...routes, ...dynamicRoutes]
}