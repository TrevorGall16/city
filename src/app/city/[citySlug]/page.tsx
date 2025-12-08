/**
 * City Sheet Page (SSG)
 * Following 03_UI section 3.2 (City Sheet Template)
 * Fixed for Next.js 15+: `params` is now a Promise that must be awaited.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { PlaceCard } from '@/components/features/PlaceCard'
import { AdContainer } from '@/components/ads/AdContainer'
import { MonthCard } from '@/components/features/MonthCard'
import { NeighborhoodCard } from '@/components/features/NeighborhoodCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CityNavigation } from '@/components/features/CityNavigation'
import { AtAGlanceDashboard } from '@/components/features/AtAGlanceDashboard'
import { CityPlacesSection } from '@/components/features/CityPlacesSection'
import type { Metadata } from 'next'
import * as Icons from 'lucide-react'

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

  // Country-specific theme configuration for colored sections
  const COUNTRY_THEMES: Record<string, { weather: string; neighborhoods: string }> = {
    fr: {
      weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100 dark:border-t-blue-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
    },
    de: {
      weather: 'bg-yellow-50 dark:bg-yellow-950/40 border-t-4 border-t-yellow-100 dark:border-t-yellow-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
    },
    es: {
      weather: 'bg-yellow-50 dark:bg-yellow-950/40 border-t-4 border-t-yellow-100 dark:border-t-yellow-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
    },
  }

  // Get theme for current country or use default
  const theme = COUNTRY_THEMES[city.country_code] || {
    weather: 'bg-slate-50 dark:bg-slate-950',
    neighborhoods: 'bg-white dark:bg-slate-950',
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
      if (index === 7 && places.length > 8) {
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
      de: 'from-black via-red-600 to-yellow-500', // German flag
      jp: 'from-white via-red-600 to-white', // Japanese flag
    }
    return gradients[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'
  }

  // City-specific vibe fonts for hero title
  const getCityFont = (citySlug: string) => {
    const fonts: Record<string, string> = {
      paris: 'font-serif', // Elegant/Romantic
      berlin: 'font-mono', // Industrial/Raw
      tokyo: 'font-sans font-black', // Futuristic/Bold
    }
    return fonts[citySlug] || 'font-serif'
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
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
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight drop-shadow-lg ${getCityFont(citySlug)}`}>
              {city.name}
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto drop-shadow">
              {city.intro_vibe}
            </p>
          </div>
        </div>
      </section>

      {/* At a Glance Dashboard - Clean Stats Row */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <AtAGlanceDashboard
            bestTimeToVisit="Apr-Jun"
            currency={`${city.stats.currency} €`}
            language="French"
            vibe="Romantic & Historic"
          />
        </div>
      </section>

      {/* General Info + Quick Stats Section */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          {/* General Info */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {city.name}
              </h2>
              {city.general_info.is_capital && (
                <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-2.5 py-0.5 rounded">
                  Capital
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              <span className="font-medium">Population:</span> {city.general_info.population}
            </p>
            <p className="text-slate-700 dark:text-slate-100 max-w-4xl">
              {city.general_info.description}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Currency</div>
              <div className="font-medium text-slate-900 dark:text-slate-50 text-lg">{city.stats.currency}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Plug Type</div>
              <div className="font-medium text-slate-900 dark:text-slate-50 text-lg">{city.stats.plug_type}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Navigation */}
      <CityNavigation />

      {/* Weather Deep Dive Section */}
      <section id="weather" className={`border-b border-slate-200 dark:border-slate-800 ${theme.weather}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader
            title="Weather Deep Dive"
            countryCode={city.country_code}
            subtitle="Month-by-month breakdown to plan your perfect trip"
          />

          {/* Mobile: Horizontal scroll, Desktop: Grid */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 min-w-max">
              {city.weather_breakdown.map((month) => (
                <MonthCard key={month.id} month={month} />
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {city.weather_breakdown.map((month) => (
              <MonthCard key={month.id} month={month} />
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className={`border-b border-slate-200 dark:border-slate-800 ${theme.neighborhoods}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader
            title="Neighborhoods"
            countryCode={city.country_code}
            subtitle="Discover the distinct vibes across the city"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.neighborhoods.map((neighborhood, index) => (
              <NeighborhoodCard key={index} neighborhood={neighborhood} />
            ))}
          </div>
        </div>
      </section>

      {/* Culture & Etiquette Section */}
      <section id="culture" className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader
            title="Culture & Etiquette"
            countryCode={city.country_code}
            subtitle="Navigate like a local with these cultural insights"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* The Golden Rules */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-xl">✨</span> The Golden Rules
              </h3>
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {city.culture.etiquette_tips.map((tip, index) => {
                  // Split on colon or dash to extract rule name
                  const parts = tip.split(/[:–-](.+)/)
                  const ruleName = parts[0]
                  const ruleText = parts[1] || tip

                  return (
                    <li key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start text-sm">
                        <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">{index + 1}.</span>
                        <div>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{ruleName}</span>
                          {parts[1] && <span className="text-slate-700 dark:text-slate-300">: {ruleText}</span>}
                          {!parts[1] && <span className="text-slate-700 dark:text-slate-300">{ruleText}</span>}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Survival Phrases */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-xl">💬</span> Survival Phrases
              </h3>
              <div className="space-y-3">
                {city.culture.essential_phrases.map((phrase, index) => (
                  <div key={index} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                    <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{phrase.src}</div>
                    <div className="text-base font-medium text-slate-900 dark:text-slate-50 mt-1">{phrase.local}</div>
                    <div className="text-xs text-indigo-600 dark:text-indigo-400 italic mt-0.5">{phrase.phonetic}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Discovery Section - Merges Must See & Must Eat */}
      <CityPlacesSection
        places={[
          ...city.must_see.flatMap((group) => group.items),
          ...city.must_eat,
        ]}
        citySlug={citySlug}
        sectionTitle="Discover"
        sectionId="discover"
      />

      {/* Logistics Section - Moved to Bottom */}
      <section id="logistics" className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <SectionHeader
          title="Travel Logistics"
          countryCode={city.country_code}
          subtitle="Essential information for a smooth trip"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.logistics.map((topic) => {
            // Dynamically get the icon component
            const IconComponent = Icons[topic.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Info

            return (
              <Link
                key={topic.id}
                href={`/city/${citySlug}/info/${topic.slug}`}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 ease-out group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                    <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {topic.summary}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
