/**
 * City Sheet Page (SSG) - MASTER AI FINAL VERSION
 * ✅ Dynamic Font Loading Integrated
 * ✅ Supabase Heartbeat (Keeps DB Awake)
 * ✅ Custom City Title Colors Palette
 * ✅ Adsterra Integrated (Google AdSense Removed)
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
// ✅ NEW: Import Adsterra Components
import AdsterraBanner from '../../../../components/ads/AdsterraBanner'
import AdsterraNative from '../../../../components/ads/AdsterraNative'

import type { Metadata } from 'next'
import * as Icons from 'lucide-react'
import { HeroGlass } from '@/components/ui/HeroGlass'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { LogisticsSection } from '@/components/features/LogisticsSection'
import { getCityFont } from '@/lib/fonts/cityFonts'

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
    const sameCountry = validCities.filter(c => c!.country_code === countryCode)
    const otherCountries = validCities.filter(c => c!.country_code !== countryCode)
    
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
    title: `${city.name} Travel Guide 2025: ${mustEatCount} Foods, ${mustSeeCount} Sights | CityBasic`,
    description: city.intro_vibe,
    openGraph: {
      title: `${city.name} Travel Guide | CityBasic`,
      description: city.intro_vibe,
      images: [city.hero_image],
      type: 'website',
      url: `https://citybasic.com/${citySlug}`,
    },
    alternates: {
      canonical: `https://citybasic.com/${citySlug}`,
    }
  }
}

export default async function CityPage({ params }: PageProps) {
  const { citySlug } = await params
  const city = await getCityData(citySlug)

  if (!city) notFound()

  // 💓 MASTER AI HEARTBEAT: Keeps Supabase from sleeping
  try {
    const { createClient } = await import('@/utils/supabase/server')
    const supabase = await createClient()
    await supabase
      .from('site_activity')
      .upsert({ id: 1, city_name: city.name, last_visited: new Date().toISOString() })
  } catch (error) {
    // Silent fail in development if Supabase isn't configured
  }

  const relatedCities = await getRelatedCities(citySlug, city.country_code)
  const cityFontClass = getCityFont(citySlug)
  const BOOKING_AID = '123456' 

  // ✅ CUSTOM CITY COLOR OVERRIDES (Palette provided by user)
  const CITY_COLOR_OVERRIDES: Record<string, string> = {
    'bangkok': 'text-yellow-400',
    'hong-kong': 'text-red-600',
    'tokyo': 'text-sky-400',
    'berlin': 'text-yellow-400',
    'london': 'text-red-600',
    'paris': 'text-white',
    'rome': 'text-green-500',
    'turkey': 'text-red-600',
    'los-angeles': 'text-orange-500',
    'new-york': 'text-blue-500',
    'rio': 'text-lime-400',
  }

  // ✅ FIXED SYNTAX: Properly declared const
  const COUNTRY_THEMES: Record<string, any> = {
    fr: { weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100', accentText: 'text-blue-900 dark:text-blue-400' },
    gb: { weather: 'bg-blue-50 dark:bg-[#0f172a] border-t-4 border-t-blue-100', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100', accentText: 'text-blue-900 dark:text-blue-400' },
    de: { weather: 'bg-yellow-50 dark:bg-yellow-950/40 border-t-4 border-t-yellow-100', neighborhoods: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100', accentText: 'text-yellow-700 dark:text-yellow-400' },
    jp: { weather: 'bg-red-50 dark:bg-[#1a0f0f] border-t-4 border-t-red-100', neighborhoods: 'bg-white dark:bg-slate-950 border-t-4 border-t-slate-200', accentText: 'text-red-700 dark:text-red-400' },
    th: { weather: 'bg-amber-50 dark:bg-amber-950/40 border-t-4 border-t-amber-100', neighborhoods: 'bg-purple-50 dark:bg-purple-950/40 border-t-4 border-t-purple-100', accentText: 'text-amber-700 dark:text-amber-400' },
    us: { weather: 'bg-cyan-50 dark:bg-cyan-950/40 border-t-4 border-t-cyan-100', neighborhoods: 'bg-pink-50 dark:bg-pink-950/40 border-t-4 border-t-pink-100', accentText: 'text-cyan-700 dark:text-cyan-400' },
    br: { weather: 'bg-green-50 dark:bg-green-900/10 border-t-4 border-t-green-100', neighborhoods: 'bg-yellow-50 dark:bg-yellow-900/10 border-t-4 border-t-yellow-100', accentText: 'text-green-700 dark:text-green-400' },
  }

  const theme = COUNTRY_THEMES[city.country_code] || {
    weather: 'bg-slate-50 dark:bg-slate-950',
    neighborhoods: 'bg-white dark:bg-slate-950',
    accentText: 'text-indigo-900 dark:text-white',
  }

  const finalHeroColor = CITY_COLOR_OVERRIDES[citySlug] || 'text-white'

  const getFlagGradient = (countryCode: string): string => {
    const gradients: Record<string, string> = {
      fr: 'from-blue-600 via-white to-red-600',
      gb: 'from-blue-900 via-red-600 to-blue-900',
      de: 'from-black via-red-600 to-yellow-500',
      jp: 'from-white via-red-600 to-white',
      th: 'from-red-600 via-white via-blue-800 via-white to-red-600',
      us: 'from-blue-800 via-white to-red-600',
      br: 'from-green-600 via-yellow-400 to-blue-600',
      hk: 'from-red-600 via-white to-red-600',
      cn: 'from-red-600 via-yellow-500 to-red-600',
      es: 'from-red-600 via-yellow-500 to-red-600',
      it: 'from-green-600 via-white to-red-600',
    }
    return gradients[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'
  }

  // ✅ UPDATED: Renders Adsterra Native inside the grid
  const renderPlacesWithAds = (places: any[]) => {
    const elements: React.ReactNode[] = []
    places.forEach((place, index) => {
      elements.push(<EnhancedPlaceCard key={place.id} place={place} citySlug={citySlug} />)
      if (index === 3) {
        elements.push(
          <div key="mobile-ad-grid" className="col-span-full py-4">
             <AdsterraNative 
               placementId="container-b6e0031bcc444be2bd24c5b310c73cb3" 
               scriptSrc="https://pl28360621.effectivegatecpm.com/b6e0031bcc444be2bd24c5b310c73cb3/invoke.js" 
             />
          </div>
        )
      }
    })
    return elements
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelGuide",
    "name": `${city.name} Travel Guide`,
    "description": city.intro_vibe,
    "url": `https://citybasic.com/${citySlug}`,
    "about": { "@type": "City", "name": city.name, "containedInPlace": { "@type": "Country", "name": city.country } }
  }

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": city.culture.etiquette_tips.slice(0, 10).map((tip) => {
      const parts = tip.split(/[:–-](.+)/)
      return { "@type": "Question", "name": parts[0].trim(), "acceptedAnswer": { "@type": "Answer", "text": parts[1]?.trim() || tip } }
    })
  }

  return (
    <div className={cityFontClass}>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }} />

        {/* Breadcrumb */}
        <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              <span>←</span><span>Back to World Map</span>
            </Link>
          </div>
        </div>

        {/* Sticky Nav */}
        <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="flex items-center gap-4 md:gap-6 overflow-x-auto py-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap flex-shrink-0 uppercase">Quick Nav:</span>
              <a href="#at-a-glance" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Overview</a>
              <a href="#weather" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Weather</a>
              <a href="#neighborhoods" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Neighborhoods</a>
              {city.itinerary && <a href="#day-plan" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">24h Plan</a>}
              <a href="#culture" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Culture</a>
              <a href="#must-see" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Must See</a>
              <a href="#must-eat" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Must Eat</a>
              <a href="#logistics" className="text-sm text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors">Logistics</a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="h-[50vh] min-h-[400px] relative overflow-hidden group">
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getFlagGradient(city.country_code)} z-20`} />
          <Image src={city.hero_image} alt={city.name} fill priority sizes="100vw" quality={85} className="object-cover transition-transform duration-[20s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <HeroGlass title={city.name} subtitle={city.intro_vibe} fontClass="font-city" titleColor={finalHeroColor} />
          </div>
        </section>

        {/* Dashboards */}
        <section id="at-a-glance" className="bg-white dark:bg-slate-950 border-b border-slate-200 py-8 scroll-mt-20">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <AtAGlanceDashboard city={city} />
          </div>
        </section>

        {/* Weather */}
        <section id="weather" className={`${theme.weather} border-b border-slate-200 scroll-mt-20`}>
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
            <SectionHeader title="Month-by-Month Weather" countryCode={city.country_code as any} accentText={theme.accentText} />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-8">
              {city.weather_breakdown.map((month, index) => (
                <MonthCard key={index} month={month} isCurrent={new Date().getMonth() === index} />
              ))}
            </div>
          </div>
        </section>

        {/* Neighborhoods */}
        <section id="neighborhoods" className={`${theme.neighborhoods} border-b border-slate-200 scroll-mt-20`}>
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
            <SectionHeader title="Neighborhoods & Where to Stay" countryCode={city.country_code as any} accentText={theme.accentText} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {city.neighborhoods.map((hood) => (
                <div key={hood.name} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg group">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <Image src={hood.image} alt={hood.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{hood.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed">{hood.description}</p>
                    <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hood.name)}&aid=${BOOKING_AID}`} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold w-full justify-center">
                      <Icons.Bed className="w-4 h-4" /> Check Hotels in {hood.name}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 24h Itinerary Timeline */}
        {city.itinerary && (
          <section id="day-plan" className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 scroll-mt-20">
            <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-12">
              <SectionHeader title="The Perfect 24 Hours" countryCode={city.country_code as any} subtitle="One perfect day, planned for you." accentText={theme.accentText} />
              <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-6 space-y-12 my-8">
                {city.itinerary.map((stop, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-12">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-900 shadow-sm"></div>
                    <div className="flex flex-col md:flex-row gap-6 group">
                      <div className="flex-1">
                        <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded mb-2">{stop.time}</span>
                        <h3 className="text-xl font-bold mb-2">{stop.title}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{stop.description}</p>
                        {stop.ticket_link && (
                          <a href={stop.ticket_link} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                            <Icons.Ticket className="w-4 h-4" /> Get Skip-the-Line Tickets →
                          </a>
                        )}
                      </div>
                      {stop.image && (
                        <div className="w-full md:w-48 h-32 relative rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-slate-200 dark:border-slate-800">
                          <Image src={stop.image} alt={stop.title} fill sizes="192px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
            <SectionHeader title="Culture & Etiquette" countryCode={city.country_code as any} accentText={theme.accentText} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-6 flex items-center gap-2">✨ The Golden Rules</h3>
                <ul className="divide-y divide-slate-200 dark:divide-slate-800">
                  {city.culture.etiquette_tips.map((tip, index) => {
                    const parts = tip.split(/[:–-](.+)/);
                    return (
                      <li key={index} className="py-4 first:pt-0 last:pb-0">
                        <div className="flex items-start text-sm">
                          <span className="mr-3 text-indigo-600 font-bold flex-shrink-0">{index + 1}.</span>
                          <div>
                            <span className="font-bold text-indigo-600">{parts[0]}</span>
                            {parts[1] && <span className="text-slate-700 dark:text-slate-300">: {parts[1]}</span>}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-indigo-900 dark:text-white mb-4 flex items-center gap-2">💬 Survival Phrases</h3>
                <div className="space-y-3">
                  {city.culture.essential_phrases.map((phrase, index) => (
                    <div key={index} className="border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0">
                      <div className="text-xs text-slate-500 uppercase tracking-wide">{phrase.src}</div>
                      <div className="text-base font-medium text-slate-900 dark:text-slate-50 mt-1">{phrase.local}</div>
                      <div className="text-xs text-indigo-600 italic mt-0.5">{phrase.phonetic}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Affiliate Section */}
        {city.affiliate_products && city.affiliate_products.length > 0 && (
          <AffiliateSection products={city.affiliate_products} cityName={city.name} countryCode={city.country_code} accentText={theme.accentText} />
        )}

        {/* Must See Section */}
        <section id="must-see" className="relative scroll-mt-20">
          <div className="max-w-[1600px] mx-auto">
            <CityPlacesSection
              places={city.must_see.flatMap((group: any) => group.items) as any}
              citySlug={citySlug}
              sectionTitle="Must See"
              sectionId="must-see-content"
              accentText={theme.accentText}
            />
          </div>
        </section>

        {/* Must Eat Section */}
        <section id="must-eat" className="bg-white dark:bg-slate-950 border-b border-slate-200 py-12 scroll-mt-20 relative">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12">
            <div className="hidden lg:grid lg:grid-cols-[1fr_300px] gap-8">
              <div>
                <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-8`}>Must Eat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {city.must_eat.map((place) => (
                    <EnhancedPlaceCard key={place.id} place={place} citySlug={citySlug} />
                  ))}
                </div>
              </div>
              <div className="sticky top-24 h-fit">
                {/* ✅ UPDATED: Sidebar uses Native Ad (fits better than fixed banner) */}
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Sponsored</h4>
                <AdsterraNative 
                  placementId="container-b6e0031bcc444be2bd24c5b310c73cb3" 
                  scriptSrc="https://pl28360621.effectivegatecpm.com/b6e0031bcc444be2bd24c5b310c73cb3/invoke.js" 
                />
              </div>
            </div>
            <div className="lg:hidden">
              <h2 className={`text-4xl md:text-5xl font-bold ${theme.accentText} mb-8`}>Must Eat</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderPlacesWithAds(city.must_eat)}</div>
            </div>
          </div>
        </section>

        {/* Logistics Section */}
        <div id="logistics" className="max-w-[1600px] mx-auto py-12">
          <CollapsibleSection title="Travel Logistics" subtitle="Safety, transit, and essential tips">
            <div className="bg-slate-50 dark:bg-slate-900 px-4 md:px-8 py-4">
              <LogisticsSection topics={city.logistics} />
            </div>
          </CollapsibleSection>
        </div>

        {/* Related Cities */}
        <section className="bg-slate-100 dark:bg-slate-900 py-16">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl font-bold mb-8">More Destinations</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedCities.map((related) => (
                <Link key={related.slug} href={`/${related.slug}`} className="group relative aspect-[3/4] rounded-xl overflow-hidden shadow-sm">
                  <Image src={related.hero_image} alt={related.name} fill sizes="300px" className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold">{related.name}</p>
                    <p className="text-white/70 text-xs">{related.country}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ UPDATED: Footer Banner uses Adsterra 728x90 */}
        <section className="max-w-[1200px] mx-auto px-4 py-12 flex justify-center">
          <AdsterraBanner 
             height={90} 
             width={728} 
             pKey="258fbd7f9475277565c29c04ed1299f6" 
           />
        </section>
      </main>
    </div>
  )
}