/**
 * City Sheet Page (SSG)
 * Following 03_UI section 3.2 (City Sheet Template)
 *
 * CRITICAL: Inject AdContainer after 6th item in grids
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { PlaceCard } from '@/components/features/PlaceCard'
import { AdContainer } from '@/components/ads/AdContainer'
import type { Metadata } from 'next'

async function getCityData(slug: string): Promise<City | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return null
  }
}

// SSG: Generate static params for all cities
export async function generateStaticParams() {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)

  return files
    .filter(file => file.endsWith('.json'))
    .map(file => ({
      citySlug: file.replace('.json', ''),
    }))
}

// SEO: Generate metadata for each city
export async function generateMetadata({
  params,
}: {
  params: { citySlug: string }
}): Promise<Metadata> {
  const city = await getCityData(params.citySlug)

  if (!city) {
    return {
      title: 'City Not Found',
    }
  }

  return {
    title: `${city.name} Travel Cheat Sheet: Must Eat & See`,
    description: `Visit ${city.name}, ${city.country}. ${city.intro_vibe} Curated recommendations with instant translation.`,
  }
}

export default async function CityPage({
  params,
}: {
  params: { citySlug: string }
}) {
  const city = await getCityData(params.citySlug)

  if (!city) {
    notFound()
  }

  // Helper function to inject ad after 6th item
  const renderPlacesWithAds = (places: typeof city.must_eat, category: string) => {
    const elements: React.ReactNode[] = []

    places.forEach((place, index) => {
      elements.push(
        <PlaceCard
          key={place.id}
          place={place}
          citySlug={params.citySlug}
        />
      )

      // Inject ad after 6th item
      if (index === 5 && places.length > 6) {
        elements.push(
          <div key={`ad-${category}-${index}`} className="col-span-full">
            <AdContainer slot="grid" />
          </div>
        )
      }
    })

    return elements
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="h-[50vh] min-h-[400px] relative">
        <Image
          src={city.hero_image}
          alt={city.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {city.name}
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              {city.intro_vibe}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 overflow-x-auto">
          <div className="flex gap-8 text-sm whitespace-nowrap">
            <div>
              <span className="text-slate-500">Currency:</span>{' '}
              <span className="font-medium text-slate-900">{city.stats.currency}</span>
            </div>
            <div>
              <span className="text-slate-500">Plug:</span>{' '}
              <span className="font-medium text-slate-900">{city.stats.plug_type}</span>
            </div>
            <div>
              <span className="text-slate-500">Best Time:</span>{' '}
              <span className="font-medium text-slate-900">{city.stats.best_time}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Safety */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Safety Tips</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {city.logistics.safety.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Scams */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Watch Out For</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {city.logistics.scams.map((scam, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{scam}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transit */}
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-3">Getting Around</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              {city.logistics.transit.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Must Eat Section */}
      {city.must_eat.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
            Must Eat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPlacesWithAds(city.must_eat, 'eat')}
          </div>
        </section>
      )}

      {/* Must See Section */}
      {city.must_see.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
            Must See
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderPlacesWithAds(city.must_see, 'see')}
          </div>
        </section>
      )}
    </main>
  )
}
