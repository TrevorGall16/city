/**
 * City Sheet Page (SSG)
 * COMPLETE SEO-OPTIMIZED VERSION
 * * ✅ All content visible to crawlers (Logistics uses <details> not Modals)
 * ✅ Structured data (JSON-LD) for rich snippets
 * ✅ Internal linking to related cities
 * ✅ Sticky TOC navigation
 * ✅ Enhanced metadata
 * ✅ FIXED: Removed <style jsx> to prevent Server Component crash
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import { MonthCard } from '@/components/features/MonthCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AtAGlanceDashboard } from '@/components/features/AtAGlanceDashboard'
import { CityPlacesSection } from '@/components/features/CityPlacesSection'
import { AffiliateSection } from '@/components/features/AffiliateSection'
import { AdUnit } from '@/components/ads/AdUnit' 
import type { Metadata } from 'next'
import * as Icons from 'lucide-react'
import { HeroGlass } from '@/components/ui/HeroGlass'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { LogisticsSection } from '@/components/features/LogisticsSection'

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

// Helper: Get related cities for internal linking (SEO Power)
async function getRelatedCities(currentSlug: string, countryCode: string, limit = 6) {
  try {
    const citiesDir = path.join(process.cwd(), 'src/data/cities')
    const files = await fs.readdir(citiesDir)
    
    const allCities = await Promise.all(
      files
        .filter(f => f !== `${currentSlug}.json` && f.endsWith('.json'))
        .map(async file => {
          try {
            const content = await fs.readFile(path.join(citiesDir, file), 'utf-8')
            const city = JSON.parse(content)
            return {
              slug: file.replace('.json', ''),
              name: city.name,
              country: city.country,
              country_code: city.country_code,
              hero_image: city.hero_image
            }
          } catch {
            return null
          }
        })
    )
    
    const validCities = allCities.filter(c => c !== null)
    
    // Prioritize same country, then random selection
    const sameCountry = validCities.filter(c => c.country_code === countryCode)
    const otherCountries = validCities.filter(c => c.country_code !== countryCode)
    
    // Take 3 from same country, 3 from others
    const selected = [
      ...sameCountry.slice(0, Math.min(3, sameCountry.length)),
      ...otherCountries.slice(0, limit - Math.min(3, sameCountry.length))
    ]
    
    return selected.slice(0, limit)
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)
  return files.filter(file => file.endsWith('.json')).map(file => ({ citySlug: file.replace('.json', '') }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params
  const city = await getCityData(citySlug)
  
  if (!city) return { title: 'City Not Found' }
  
  const mustSeeCount = city.must_see.flatMap(g => g.items).length
  const mustEatCount = city.must_eat.length
  
  return {
    title: `${city.name} Travel Guide 2025: ${mustEatCount} Foods, ${mustSeeCount} Sights, Local Tips | CityBasic`,
    description: `Complete ${city.name} travel guide with ${mustEatCount} must-eat foods, ${mustSeeCount} top attractions, month-by-month weather, neighborhoods, and insider tips. ${city.intro_vibe}`,
    keywords: [
      `${city.name} travel guide`,
      `${city.name} tourism`,
      `${city.name} food`,
      `${city.name} restaurants`,
      `${city.name} attractions`,
      `visit ${city.name}`,
      `${city.name} tips`,
      `${city.name} itinerary`,
      `what to eat in ${city.name}`,
      `things to do in ${city.name}`
    ].join(', '),
    openGraph: {
      title: `${city.name} Travel Guide | CityBasic`,
      description: city.intro_vibe,
      images: [city.hero_image],
      type: 'website',
      url: `https://citybasic.com/${citySlug}`,
      siteName: 'CityBasic'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${city.name} Travel Guide | CityBasic`,
      description: city.intro_vibe,
      images: [city.hero_image],
    },
    alternates: {
      canonical: `https://citybasic.com/${citySlug}`,
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

export default async function CityPage({ params }: PageProps) {
  const { citySlug } = await params
  const city = await getCityData(citySlug)

  if (!city) notFound()

  // Get related cities for internal linking
  const relatedCities = await getRelatedCities(citySlug, city.country_code)

  // 🔴 Replace with your actual Booking.com Affiliate ID
  const BOOKING_AID = '123456' 

  // Theme Config
  const COUNTRY_THEMES: Record<string, { weather: string; neighborhoods: string; accentText: string }> = {
    fr: { weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100 dark:border-t-blue-900', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900', accentText: 'text-blue-900 dark:text-blue-400' },
    gb: { weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100 dark:border-t-blue-900', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900', accentText: 'text-blue-900 dark:text-blue-400' },
    de: { weather: 'bg-yellow-50 dark:bg-yellow-950/40 border-t-4 border-t-yellow-100 dark:border-t-yellow-900', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900', accentText: 'text-yellow-700 dark:text-yellow-400' },
    jp: { weather: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100 dark:border-t-red-900', neighborhoods: 'bg-white dark:bg-slate-950 border-t-4 border-t-slate-200 dark:border-t-slate-800', accentText: 'text-red-700 dark:text-red-400' },
    th: { weather: 'bg-amber-50 dark:bg-amber-950/40 border-t-4 border-t-amber-100 dark:border-t-amber-900', neighborhoods: 'bg-purple-50 dark:bg-purple-950/40 border-t-4 border-t-purple-100 dark:border-t-purple-900', accentText: 'text-amber-700 dark:text-amber-400' },
    us: { weather: 'bg-cyan-50 dark:bg-cyan-950/40 border-t-4 border-t-cyan-100 dark:border-t-cyan-900', neighborhoods: 'bg-pink-50 dark:bg-pink-950/40 border-t-4 border-t-pink-100 dark:border-t-pink-900', accentText: 'text-cyan-700 dark:text-cyan-400' },
  }

  const theme = COUNTRY_THEMES[city.country_code] || {
    weather: 'bg-slate-50 dark:bg-slate-950',
    neighborhoods: 'bg-white dark:bg-slate-950',
    accentText: 'text-indigo-900 dark:text-white',
  }

  const renderPlacesWithAds = (places: typeof city.must_eat) => {
    const elements: React.ReactNode[] = []
    places.forEach((place, index) => {
      elements.push(<EnhancedPlaceCard key={place.id} place={place} citySlug={citySlug} />)
      if (index === 3) elements.push(<div key="mobile-ad-grid" className="col-span-full py-4"><AdUnit type="grid" /></div>)
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
      tokyo: 'font-tokyo text-7xl md:text-9xl tracking-widest text-cyan-400',
      bangkok: 'font-bangkok text-7xl md:text-9xl tracking-wide text-amber-500',
      paris: 'font-paris text-8xl md:text-[10rem] tracking-tight text-white',
      rome: 'font-rome text-6xl md:text-8xl text-green-600',
      'los-angeles': 'font-la text-7xl md:text-9xl text-orange-400',
      'new-york': 'font-ny text-6xl md:text-8xl uppercase tracking-wider text-blue-500',
      berlin: 'font-berlin text-6xl md:text-8xl uppercase text-yellow-400',
      london: 'font-london text-7xl md:text-9xl text-red-600',
      istanbul: 'font-istanbul text-7xl md:text-9xl tracking-wide text-orange-400',
      dubai: 'font-dubai text-6xl md:text-8xl uppercase text-amber-200',
      'hong-kong': 'font-hk text-7xl md:text-9xl uppercase tracking-tighter text-red-500',
      'new-delhi': 'font-serif font-bold text-orange-400',
      mecca: 'font-serif font-medium text-emerald-400',
      guangzhou: 'font-sans font-bold text-white',
    }
    return fonts[slug] || 'font-sans font-bold text-white'
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "name": `${city.name} Travel Guide`,
    "description": city.intro_vibe,
    "url": `https://citybasic.com/${citySlug}`,
    "inLanguage": "en",
    "about": {
      "@type": "City",
      "name": city.name,
      "containedInPlace": {
        "@type": "Country",
        "name": city.country
      }
    },
    "author": {
      "@type": "Organization",
      "name": "CityBasic",
      "url": "https://citybasic.com"
    }
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": city.culture.etiquette_tips.slice(0, 10).map((tip) => {
      const parts = tip.split(/[:–-](.+)/)
      return {
        "@type": "Question",
        "name": parts[0].trim(),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": parts[1]?.trim() || tip
        }
      }
    })
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://citybasic.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": city.name,
        "item": `https://citybasic.com/${citySlug}`
      }
    ]
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* ✅ Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
            <span>←</span><span>Back to World Map</span>
          </Link>
        </div>
      </div>

      {/* ✅ Sticky Table of Contents Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0">
              QUICK NAV:
            </span>
            <a 
              href="#at-a-glance" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Overview
            </a>
            <a 
              href="#weather" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Weather
            </a>
            <a 
              href="#neighborhoods" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Neighborhoods
            </a>
            {city.itinerary && (
              <a 
                href="#day-plan" 
                className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
              >
                24h Plan
              </a>
            )}
            <a 
              href="#culture" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Culture
            </a>
            <a 
              href="#must-see" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Must See
            </a>
            <a 
              href="#must-eat" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Must Eat
            </a>
            <a 
              href="#logistics" 
              className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap transition-colors"
            >
              Logistics
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-[50vh] min-h-[400px] relative overflow-hidden group">
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getFlagGradient(city.country_code)} z-20`} />
        <Image 
          src={city.hero_image} 
          alt={`${city.name} hero image`} 
          fill 
          priority 
          sizes="100vw"
          quality={85}
          className="object-cover transition-transform duration-[20s] group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <HeroGlass title={city.name} subtitle={city.intro_vibe} fontClass={getCityFont(citySlug)} />
        </div>
      </section>

      {/* At-A-Glance Dashboard */}
      <section id="at-a-glance" className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-8 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8">
          <AtAGlanceDashboard city={city} />
        </div>
      </section>

      {/* Weather Breakdown */}
      <section id="weather" className={`${theme.weather} border-b border-slate-200 dark:border-slate-800 scroll-mt-20`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader 
            title="Month-by-Month Weather" 
            countryCode={city.country_code} 
            subtitle="Plan the perfect time to visit" 
            accentText={theme.accentText} 
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-8">
            {city.weather_breakdown.map((month, index) => (
              <MonthCard 
                key={index} 
                month={month} 
                isCurrent={new Date().getMonth() === index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Neighborhoods Section */}
      <section id="neighborhoods" className={`${theme.neighborhoods} border-b border-slate-200 dark:border-slate-800 scroll-mt-20`}>
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader 
            title="Neighborhoods & Where to Stay" 
            countryCode={city.country_code} 
            subtitle="Find the perfect base for your trip" 
            accentText={theme.accentText} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {city.neighborhoods.map((hood) => (
              <div key={hood.name} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image 
                    src={hood.image} 
                    alt={`${hood.name} neighborhood in ${city.name}`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={80}
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                      {hood.vibe}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{hood.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">{hood.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hood.highlights.map((highlight, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded">
                        {highlight}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hood.name + ', ' + city.name)}&aid=${BOOKING_AID}`}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg w-full justify-center"
                  >
                    <Icons.Bed className="w-4 h-4" />
                    Check Hotels in {hood.name}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Day Plan / 24h Itinerary */}
      {city.itinerary && (
        <section id="day-plan" className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 scroll-mt-20">
          <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12">
            <SectionHeader
              title="The Perfect 24 Hours"
              countryCode={city.country_code}
              subtitle="One perfect day, planned for you."
              accentText={theme.accentText}
            />
            <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 ml-4 md:ml-6 space-y-12 my-8">
              {city.itinerary.map((stop, idx) => (
                <div key={idx} className="relative pl-8 md:pl-12">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                  <div className="flex flex-col md:flex-row gap-6 group">
                    <div className="flex-1">
                      <span className="inline-block px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded mb-2">
                        {stop.time}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">{stop.title}</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{stop.description}</p>
                      {stop.ticket_link && (
                        <a 
                          href={stop.ticket_link} 
                          target="_blank" 
                          rel="noopener noreferrer sponsored" 
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                        >
                          <Icons.Ticket className="w-4 h-4" />
                          Get Skip-the-Line Tickets →
                        </a>
                      )}
                    </div>
                    {stop.image && (
                      <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-slate-200 dark:border-slate-800">
                        <Image 
                          src={stop.image} 
                          alt={stop.title} 
                          fill 
                          sizes="(max-width: 768px) 100vw, 192px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Culture & Etiquette */}
      <section id="culture" className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 border-b border-indigo-100 dark:border-slate-800 scroll-mt-20">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          <SectionHeader 
            title="Culture & Etiquette" 
            countryCode={city.country_code} 
            subtitle="Navigate like a local" 
            accentText={theme.accentText} 
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="text-xl">✨</span> The Golden Rules
              </h3>
              <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                {city.culture.etiquette_tips.map((tip, index) => {
                  const parts = tip.split(/[:–-](.+)/)
                  return (
                    <li key={index} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start text-sm">
                        <span className="mr-3 text-indigo-600 dark:text-indigo-400 font-bold flex-shrink-0">{index + 1}.</span>
                        <div>
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">{parts[0]}</span>
                          {parts[1] && <span className="text-slate-700 dark:text-slate-300">: {parts[1]}</span>}
                          {!parts[1] && <span className="text-slate-700 dark:text-slate-300">{tip}</span>}
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

      {/* Affiliate Section */}
      {city.affiliate_products && city.affiliate_products.length > 0 && (
        <AffiliateSection 
          products={city.affiliate_products} 
          cityName={city.name} 
          countryCode={city.country_code} 
          accentText={theme.accentText} 
        />
      )}

      {/* Must See Section */}
      <section id="must-see" className="relative scroll-mt-20">
        {/* Extra anchor for backward compatibility */}
        <div id="discover" className="absolute -top-20 w-full h-1" />
        <div className="max-w-[1600px] mx-auto">
          <CityPlacesSection
            places={city.must_see.flatMap((group) => group.items)}
            citySlug={citySlug}
            sectionTitle="Must See"
            sectionId="must-see-content"
            accentText={theme.accentText}
          />
        </div>
      </section>

      {/* Mobile Ad */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="lg:hidden max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          <AdUnit type="grid" className="max-w-[300px] mx-auto" />
        </div>
      </section>

      {/* Must Eat Section */}
      <section id="must-eat" className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 scroll-mt-20 relative">
        {/* Extra anchor for backward compatibility */}
        <div id="food" className="absolute -top-20 w-full h-1" />
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
          
          {/* Desktop: 2-column layout with sticky sidebar ad */}
          <div className="hidden lg:grid lg:grid-cols-[1fr_300px] gap-8">
            <div>
              <div className="mb-8">
                <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-2`}>Must Eat</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Essential food and drink experiences in {city.name}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {city.must_eat.map((place) => (
                  <EnhancedPlaceCard key={place.id} place={place} citySlug={citySlug} />
                ))}
              </div>
            </div>
            <div className="sticky top-24 h-fit">
              <AdUnit type="sidebar" />
            </div>
          </div>

          {/* Mobile: Single column with interstitial ad */}
          <div className="lg:hidden">
            <div className="mb-8">
              <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-2`}>Must Eat</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Essential food and drink experiences in {city.name}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderPlacesWithAds(city.must_eat)}
            </div>
          </div>
        </div>
      </section>

{/* ✅ LOGISTICS SECTION - FIXED: Collapsible Container + Modal Content */}
      <div className="max-w-[1600px] mx-auto">
        <CollapsibleSection title="Travel Logistics" subtitle="Safety, transit, and essential tips">
          <div className="bg-slate-50 dark:bg-slate-900 px-4 md:px-8 py-4">
            {/* Using the client component to handle the full-screen popup */}
            <LogisticsSection topics={city.logistics} />
          </div>
        </CollapsibleSection>
      </div>
      {/* Final Banner Ad */}
      <section className="max-w-[1200px] mx-auto px-4 py-12">
        <AdUnit type="banner" />
      </section>
    </main>
  )
}