/**
 * City Sheet Page (SSG)
 * Following 03_UI section 3.2 (City Sheet Template)
 * Fixed for Next.js 15+: `params` is now a Promise that must be awaited.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { PlaceCard } from '@/components/features/PlaceCard'
import { AdContainer } from '@/components/ads/AdContainer'
import { BestTimeCalendar } from '@/components/features/BestTimeCalendar'
import type { Metadata } from 'next'

// Type definition for Page Props in Next.js 15+
interface PageProps {
  params: Promise<{ citySlug: string }>
}

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
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Await params before accessing properties
  const { citySlug } = await params
  const city = await getCityData(citySlug)

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

export default async function CityPage({ params }: PageProps) {
  // Await params before accessing properties
  const { citySlug } = await params
  const city = await getCityData(citySlug)

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
          citySlug={citySlug} // Use the resolved slug variable
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

  // Flag theme gradient based on country code
  const getFlagGradient = (countryCode: string) => {
    const gradients: Record<string, string> = {
      fr: 'from-blue-600 via-white to-red-600', // French flag
      // Add more countries as needed
    }
    return gradients[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section with Flag Theme & Map Background */}
      <section className="h-[50vh] min-h-[400px] relative overflow-hidden">
        {/* Flag gradient accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getFlagGradient(city.country_code)} z-20`} />

        {/* City image */}
        <Image
          src={city.hero_image}
          alt={city.name}
          fill
          priority
          className="object-cover"
        />

        {/* Abstract map pattern overlay (placeholder for SVG) */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:40px_40px]" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
              {city.name}
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto drop-shadow">
              {city.intro_vibe}
            </p>
          </div>
        </div>
      </section>

      {/* General Info + Quick Stats Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          {/* General Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-slate-900">
                {city.name}
              </h2>
              {city.general_info.is_capital && (
                <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Capital
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mb-2">
              <span className="font-medium">Population:</span> {city.general_info.population}
            </p>
            <p className="text-slate-700 max-w-4xl">
              {city.general_info.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Currency</div>
              <div className="font-medium text-slate-900 text-lg">{city.stats.currency}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Plug Type</div>
              <div className="font-medium text-slate-900 text-lg">{city.stats.plug_type}</div>
            </div>
            <div className="md:col-span-1">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Best Time to Visit</div>
              <BestTimeCalendar
                bestMonths={city.stats.best_time.months}
                summary={city.stats.best_time.summary}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Etiquette Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white border-b border-indigo-100">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900">
            Culture & Etiquette
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Golden Rules */}
            <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-xl">✨</span> The Golden Rules
              </h3>
              <ul className="space-y-3">
                {city.culture.etiquette_tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-sm text-slate-700">
                    <span className="mr-3 text-indigo-600 font-bold">{index + 1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Survival Phrases */}
            <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 mb-4 flex items-center gap-2">
                <span className="text-xl">💬</span> Survival Phrases
              </h3>
              <div className="space-y-3">
                {city.culture.essential_phrases.map((phrase, index) => (
                  <div key={index} className="border-b border-slate-100 pb-3 last:border-0">
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{phrase.src}</div>
                    <div className="text-base font-medium text-slate-900 mt-1">{phrase.local}</div>
                    <div className="text-xs text-indigo-600 italic mt-0.5">{phrase.phonetic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Must See Section */}
      {city.must_see.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
            Must See
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {renderPlacesWithAds(city.must_see, 'see')}
          </div>
        </section>
      )}

      {/* Must Eat Section */}
      {city.must_eat.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-slate-50">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
            Must Eat
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {renderPlacesWithAds(city.must_eat, 'eat')}
          </div>
        </section>
      )}

      {/* Logistics Section - Moved to Bottom */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">
          Travel Logistics
        </h2>
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
    </main>
  )
}
