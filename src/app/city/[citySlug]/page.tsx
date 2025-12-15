/**
 * City Sheet Page (SSG)
 * Final Version with Ads & Fonts
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { PlaceCard } from '@/components/features/PlaceCard'
import { MonthCard } from '@/components/features/MonthCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CityNavigation } from '@/components/features/CityNavigation'
import { AtAGlanceDashboard } from '@/components/features/AtAGlanceDashboard'
import { CityPlacesSection } from '@/components/features/CityPlacesSection'
import { AffiliateSection } from '@/components/features/AffiliateSection'
import { AdUnit } from '@/components/ads/AdUnit' // ✅ Single, correct import
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
  const { citySlug } = await params
  const city = await getCityData(citySlug)

  if (!city) {
    return {
      title: 'City Not Found | CitySheet',
      description: 'This city is not available in our travel guides yet.',
    }
  }

  return {
    title: `${city.name} Travel Guide | CitySheet`,
    description: `Complete ${city.name} travel guide. ${city.intro_vibe}`,
  }
}

export default async function CityPage({ params }: PageProps) {
  const { citySlug } = await params
  const city = await getCityData(citySlug)

  if (!city) {
    notFound()
  }

  // Color Theme Configuration
  const COUNTRY_THEMES: Record<string, { weather: string; neighborhoods: string; accentText: string }> = {
    fr: {
      weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100 dark:border-t-blue-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
      accentText: 'text-blue-900 dark:text-blue-400',
    },
    gb: {
      weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100 dark:border-t-blue-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
      accentText: 'text-blue-900 dark:text-blue-400',
    },
    de: {
      weather: 'bg-yellow-50 dark:bg-yellow-950/40 border-t-4 border-t-yellow-100 dark:border-t-yellow-900',
      neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
      accentText: 'text-yellow-700 dark:text-yellow-400',
    },
    jp: {
      weather: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900',
      neighborhoods: 'bg-white dark:bg-slate-950 border-t-4 border-t-slate-200 dark:border-t-slate-800',
      accentText: 'text-red-700 dark:text-red-400',
    },
    th: {
      weather: 'bg-amber-50 dark:bg-amber-950/40 border-t-4 border-t-amber-100 dark:border-t-amber-900',
      neighborhoods: 'bg-purple-50 dark:bg-purple-950/40 border-t-4 border-t-purple-100 dark:border-t-purple-900',
      accentText: 'text-amber-700 dark:text-amber-400',
    },
    us: {
      weather: 'bg-cyan-50 dark:bg-cyan-950/40 border-t-4 border-t-cyan-100 dark:border-t-cyan-900',
      neighborhoods: 'bg-pink-50 dark:bg-pink-950/40 border-t-4 border-t-pink-100 dark:border-t-pink-900',
      accentText: 'text-cyan-700 dark:text-cyan-400',
    },
  }

  const theme = COUNTRY_THEMES[city.country_code] || {
    weather: 'bg-slate-50 dark:bg-slate-950',
    neighborhoods: 'bg-white dark:bg-slate-950',
    accentText: 'text-indigo-900 dark:text-white',
  }

  // ✅ MOBILE AD LOGIC: Inject 'grid' ad after the 4th item
  const renderPlacesWithAds = (places: typeof city.must_eat) => {
    const elements: React.ReactNode[] = []
    places.forEach((place, index) => {
      elements.push(
        <PlaceCard key={place.id} place={place} citySlug={citySlug} />
      )
      if (index === 3) { // After 4th item
        elements.push(
          <div key="mobile-ad-grid" className="col-span-full py-4">
            <AdUnit type="grid" />
          </div>
        )
      }
    })
    return elements
  }

  const getFlagGradient = (countryCode: string) => {
    const gradients: Record<string, string> = {
      fr: 'from-blue-600 via-white to-red-600',
      gb: 'from-blue-900 via-red-600 to-blue-900',
      de: 'from-black via-red-600 to-yellow-500',
      jp: 'from-white via-red-600 to-white',
    }
    return gradients[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'
  }

  const getCityFont = (slug: string) => {
    const fonts: Record<string, string> = {
      // 🇯🇵 Tokyo: Neon Cyan (Cyberpunk)
      tokyo: 'font-tokyo text-7xl md:text-9xl tracking-widest text-cyan-400',
      
      // 🇹🇭 Bangkok: Golden Orange (Temples & Sun)
      bangkok: 'font-bangkok text-7xl md:text-9xl tracking-wide text-amber-500',
      
      // 🇫🇷 Paris: Soft Rose or Classic White
      paris: 'font-paris text-8xl md:text-[10rem] tracking-tight text-white',
      
      // 🇮🇹 Rome: Roman Gold
      rome: 'font-rome text-6xl md:text-8xl text-green-600',
      
      // 🇺🇸 Los Angeles: Sunset Pink or Ocean Blue
      'los-angeles': 'font-la text-7xl md:text-9xl text-orange-400',
      
      // 🇺🇸 New York: Taxi Yellow
      'new-york': 'font-ny text-6xl md:text-8xl uppercase tracking-wider text-blue-500',
      
      // 🇩🇪 Berlin: Electric Lime (Techno)
      berlin: 'font-berlin text-6xl md:text-8xl uppercase text-yellow-400',
      
      // 🇬🇧 London: Bus Red or Royal White
      london: 'font-london text-7xl md:text-9xl text-red-600',
      
      // 🇹🇷 Istanbul: Spice Orange
      istanbul: 'font-istanbul text-7xl md:text-9xl tracking-wide text-orange-400',
      
      // 🇦🇪 Dubai: Luxury Gold
      dubai: 'font-dubai text-6xl md:text-8xl uppercase text-amber-200',
      
      // 🇨🇳 Hong Kong: Neon Red
      'hong-kong': 'font-hk text-7xl md:text-9xl uppercase tracking-tighter text-red-500',
      
      // Defaults
      'new-delhi': 'font-serif font-bold text-orange-400',
      mecca: 'font-serif font-medium text-emerald-400',
      guangzhou: 'font-sans font-bold text-white',
    }
    return fonts[slug] || 'font-sans font-bold text-white'
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
            <span>←</span>
            <span>Back to World Map</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="h-[50vh] min-h-[400px] relative overflow-hidden group">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getFlagGradient(city.country_code)} z-20`} />
        
        <Image 
          src={city.hero_image} 
          alt={city.name} 
          fill 
          priority 
          className="object-cover transition-transform duration-[20s] group-hover:scale-110" 
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="relative max-w-4xl mx-auto text-center rounded-[3rem] overflow-visible p-8 md:p-12">
            
            <div className={`
              absolute inset-0 
              bg-black/30
              backdrop-blur-xl
              border border-white/10 
              rounded-[3rem] 
              shadow-[0_0_80px_rgba(0,0,0,0.5)]
            `} />
            
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] rounded-[3rem]" />

            <div className="relative z-10">
              <h1 className={`text-5xl md:text-8xl drop-shadow-2xl mb-4 ${getCityFont(citySlug)}`}>
                {city.name}
              </h1>
              <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                {city.intro_vibe}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <AtAGlanceDashboard city={city} />
        </div>
      </section>

      {/* Info & Stats */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{city.name}</h2>
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

      <CityNavigation />

      {/* Weather */}
      <section id="weather" className={`border-b border-slate-200 dark:border-slate-800 ${theme.weather}`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader
            title="Weather Deep Dive"
            countryCode={city.country_code}
            subtitle="Month-by-month breakdown"
            accentText={theme.accentText}
          />
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

      {/* Neighborhoods */}
      <section id="neighborhoods" className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              Neighborhoods
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
              The distinct vibes and areas that define the city.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {city.neighborhoods.map((hood) => (
              <div key={hood.name} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image Header with overflow-hidden fix */}
                <div className="relative h-64 w-full bg-slate-200 overflow-hidden">
                  {hood.image ? (
                    <Image
                      src={hood.image}
                      alt={hood.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                      <span className="text-4xl">🏙️</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{hood.name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-sm font-semibold text-white border border-white/30">
                      {hood.vibe}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
                    {hood.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {hood.highlights.map((highlight) => (
                      <span key={highlight} className="text-xs font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section id="culture" className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-indigo-100 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader
            title="Culture & Etiquette"
            countryCode={city.country_code}
            subtitle="Navigate like a local"
            accentText={theme.accentText}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-xl">✨</span> The Golden Rules
              </h3>
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {city.culture.etiquette_tips.map((tip, index) => {
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

      {/* Affiliate */}
      {city.affiliate_products && city.affiliate_products.length > 0 && (
        <AffiliateSection
          products={city.affiliate_products}
          cityName={city.name}
          countryCode={city.country_code}
          accentText={theme.accentText}
        />
      )}

      {/* Discover Section (Must See) */}
      <div className="relative scroll-mt-24">
        {/* Scroll Anchors */}
        <div id="must-see" className="absolute -top-24 left-0" />
        <div id="discover" className="absolute -top-24 left-0" />
        <div id="landmarks" className="absolute -top-24 left-0" />
        
        <CityPlacesSection
          places={city.must_see.flatMap((group) => group.items)}
          citySlug={citySlug}
          sectionTitle="Discover"
          sectionId="discover-inner"
          accentText={theme.accentText}
        />
      </div>

      {/* Mobile Ad (Grid) - Between Sections */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="lg:hidden max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          <AdUnit type="grid" className="max-w-[300px] mx-auto" />
        </div>
      </section>

      {/* Must Eat Section */}
      <section
        id="must-eat"
        className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-24 relative"
      >
        <div id="food" className="absolute -top-24 left-0 visibility-hidden"></div>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          
          {/* DESKTOP LAYOUT (With Sidebar Ad) */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_300px] gap-8">
            <div>
              <div className="mb-8">
                <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-2`}>Must Eat</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">Essential food and drink experiences in {city.name}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {city.must_eat.map((place) => (
                  <PlaceCard key={place.id} place={place} citySlug={citySlug} />
                ))}
              </div>
            </div>
            
            {/* ✅ SIDEBAR AD */}
            <div className="sticky top-24 h-fit">
              <AdUnit type="sidebar" />
            </div>
          </div>

          {/* MOBILE LAYOUT (With In-Grid Ad) */}
          <div className="lg:hidden">
            <div className="mb-8">
              <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-2`}>Must Eat</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Essential food and drink experiences in {city.name}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPlacesWithAds(city.must_eat)}
            </div>
          </div>
        </div>
      </section>

      {/* Logistics */}
      <section id="logistics" className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <SectionHeader
          title="Travel Logistics"
          countryCode={city.country_code}
          subtitle="Essential information"
          accentText={theme.accentText}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.logistics.map((topic) => {
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

      {/* ✅ FOOTER BANNER AD */}
      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <AdUnit type="banner" />
      </section>

    </main>
  )
}