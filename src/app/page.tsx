/**
 * HOME PAGE - COMPLETE SEO-OPTIMIZED VERSION
 * 
 * ✅ Server Component (no 'use client' at root)
 * ✅ Dynamic city loading (all 202 cities, not just 9)
 * ✅ Proper metadata with keywords
 * ✅ Structured data (JSON-LD)
 * ✅ URL state for search queries
 * ✅ Visual improvements
 * ✅ Performance optimizations
 */

import { promises as fs } from 'fs'
import path from 'path'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { HomePageClient } from '@/components/pages/HomePageClient'

// Server-side: Load ALL cities from JSON files
async function getAllCities() {
  try {
    const citiesDir = path.join(process.cwd(), 'src/data/cities')
    const files = await fs.readdir(citiesDir)
    
    const cities = await Promise.all(
      files
        .filter(file => file.endsWith('.json'))
        .map(async file => {
          try {
            const filePath = path.join(citiesDir, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const city = JSON.parse(content)
            
            return {
              name: city.name,
              country: city.country,
              country_code: city.country_code,
              slug: city.slug,
              image: city.hero_image,
              intro_vibe: city.intro_vibe,
              // Determine priority: first 3 cities get priority
              priority: false // We'll set this dynamically below
            }
          } catch (error) {
            console.error(`Error loading ${file}:`, error)
            return null
          }
        })
    )
    
    const validCities = cities.filter(c => c !== null)
    
    // Sort by popularity or alphabetically (you can customize this)
    validCities.sort((a, b) => a.name.localeCompare(b.name))
    
    // Set priority on first 3 cities only (for LCP optimization)
    validCities.forEach((city, index) => {
      if (index < 3) city.priority = true
    })
    
    return validCities
  } catch (error) {
    console.error('Error reading cities directory:', error)
    return []
  }
}

// Metadata generation
export async function generateMetadata(): Promise<Metadata> {
  const cities = await getAllCities()
  const cityCount = cities.length
  
  return {
    metadataBase: new URL('https://citybasic.com'), // ✅ Add this line
    title: `CityBasic: Travel Cheat Sheets for ${cityCount} Cities | Food, Sights & Local Tips`,
    description: `Fast, practical travel guides for ${cityCount} cities worldwide. Discover essential restaurants, must-see attractions, cultural etiquette, and local logistics—minus the travel blog fluff. Start planning smarter trips today.`,
    keywords: [
      'travel guides',
      'city travel tips',
      'travel cheat sheets',
      'city food guides',
      'local travel tips',
      'travel essentials',
      'city attractions',
      'travel planning',
      'destination guides',
      'travel recommendations'
    ].join(', '),
    openGraph: {
      title: `CityBasic: Travel Smart. Not Hard.`,
      description: `Essential travel guides for ${cityCount} cities worldwide.`,
      type: 'website',
      url: 'https://citybasic.com',
      siteName: 'CityBasic',
      images: [
        {
          url: '/images/og-image.jpg', // Create this
          width: 1200,
          height: 630,
          alt: 'CityBasic Travel Guides'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `CityBasic: Travel Cheat Sheets for ${cityCount} Cities`,
      description: `Essential food, sights, and tips for ${cityCount} cities—minus the fluff.`,
      images: ['/images/og-image.jpg'],
    },
    alternates: {
      canonical: 'https://citybasic.com',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      }
    }
  }
}

export default async function HomePage() {
  // Load all cities server-side
  const allCities = await getAllCities()
  
  // Group cities by region
  const regions = groupCitiesByRegion(allCities)
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CityBasic",
    "url": "https://citybasic.com",
    "description": `Travel guides for ${allCities.length} cities worldwide`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://citybasic.com/?search={search_term}"
      },
      "query-input": "required name=search_term"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CityBasic",
      "url": "https://citybasic.com"
    }
  }
  
  const collectionPageData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Travel Guides Collection",
    "description": `Comprehensive travel guides for ${allCities.length} cities`,
    "url": "https://citybasic.com",
    "hasPart": allCities.slice(0, 50).map(city => ({ // Limit to 50 for performance
      "@type": "TravelGuide",
      "name": `${city.name} Travel Guide`,
      "url": `https://citybasic.com/${city.slug}`,
      "about": {
        "@type": "City",
        "name": city.name
      }
    }))
  }
  
return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageData) }}
      />
      
      {/* ✅ Wrap this in Suspense to fix the Netlify build error */}
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <HomePageClient cities={allCities} regions={regions} />
      </Suspense>
    </>
  )
}

// Helper: Group cities by region (Fixed for TypeScript compatibility)
function groupCitiesByRegion(cities: any[]) {
  // Define a stricter structure for the map to satisfy the compiler
  const regionMap: Record<string, { 
    name: string; 
    countries: Record<string, { 
      name: string; 
      country_code: string; 
      cities: any[] 
    }> 
  }> = {}
  
  cities.forEach(city => {
    const regionName = getRegionForCountry(city.country)
    
    if (!regionMap[regionName]) {
      regionMap[regionName] = {
        name: regionName,
        countries: {}
      }
    }
    
    if (!regionMap[regionName].countries[city.country]) {
      regionMap[regionName].countries[city.country] = {
        name: city.country,
        country_code: city.country_code,
        cities: []
      }
    }
    
    regionMap[regionName].countries[city.country].cities.push(city)
  })
  
  // Convert the nested objects into the clean array format the Client Component expects
  return Object.values(regionMap).map(region => ({
    name: region.name,
    countries: Object.values(region.countries)
  }))
}

// Helper: Determine region from country
function getRegionForCountry(country: string): string {
  const regionMapping: Record<string, string> = {
    // Europe
    'United Kingdom': 'Europe',
    'France': 'Europe',
    'Germany': 'Europe',
    'Italy': 'Europe',
    'Spain': 'Europe',
    'Netherlands': 'Europe',
    'Belgium': 'Europe',
    'Switzerland': 'Europe',
    'Austria': 'Europe',
    'Portugal': 'Europe',
    'Greece': 'Europe',
    'Czech Republic': 'Europe',
    'Poland': 'Europe',
    'Hungary': 'Europe',
    'Sweden': 'Europe',
    'Norway': 'Europe',
    'Denmark': 'Europe',
    'Finland': 'Europe',
    
    // Asia
    'Japan': 'Asia',
    'China': 'Asia',
    'South Korea': 'Asia',
    'Thailand': 'Asia',
    'Vietnam': 'Asia',
    'Singapore': 'Asia',
    'Malaysia': 'Asia',
    'Indonesia': 'Asia',
    'Philippines': 'Asia',
    'India': 'Asia',
    'Hong Kong': 'Asia',
    'Taiwan': 'Asia',
    
    // North America
    'United States': 'North America',
    'Canada': 'North America',
    'Mexico': 'North America',
    
    // Middle East
    'Turkey': 'Middle East',
    'United Arab Emirates': 'Middle East',
    'Saudi Arabia': 'Middle East',
    'Israel': 'Middle East',
    'Qatar': 'Middle East',
    
    // South America
    'Brazil': 'South America',
    'Argentina': 'South America',
    'Chile': 'South America',
    'Peru': 'South America',
    'Colombia': 'South America',
    
    // Africa
    'Egypt': 'Africa',
    'South Africa': 'Africa',
    'Morocco': 'Africa',
    'Kenya': 'Africa',
    
    // Oceania
    'Australia': 'Oceania',
    'New Zealand': 'Oceania',
  }
  
  return regionMapping[country] || 'Other'
}
