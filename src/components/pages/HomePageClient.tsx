'use client'

import { useRef } from 'react'
import { CityCard } from '@/components/features/CityCard'
import { Map, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'

import { AdsterraDisplayBanner } from '@/components/ads/AdsterraDisplayBanner'

const InteractiveWorldMap = dynamic(
  () => import('@/components/features/InteractiveWorldMap').then((mod) => mod.InteractiveWorldMap),
  { 
    ssr: false, 
    loading: () => <div className="w-full h-[400px] bg-slate-100 dark:bg-slate-900 animate-pulse rounded-2xl mb-12" /> 
  }
)

const COUNTRY_FLAGS: Record<string, string> = {
  'France': '🇫🇷', 'Germany': '🇩🇪', 'Japan': '🇯🇵', 'United Kingdom': '🇬🇧',
  'Thailand': '🇹🇭', 'United States': '🇺🇸', 'Turkey': '🇹🇷', 'Italy': '🇮🇹',
  'Spain': '🇪🇸', 'China': '🇨🇳', 'South Korea': '🇰🇷', 'Brazil': '🇧🇷',
  'India': '🇮🇳', 'Hong Kong': '🇭🇰'
}

export function HomePageClient({ cities, regions, lang, translations }: any) {
  const gridRef = useRef<HTMLDivElement>(null)

  const scrollToExplore = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight">
           {translations.hero_title}
        </h1>
        <p className="mt-4 text-lg text-slate-500 font-medium max-w-xl mx-auto">
          {translations.hero_subtitle}
        </p>
        <div className="pt-8">
          <button 
            onClick={scrollToExplore}
            className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 mx-auto"
          >
            Start Exploring <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Ad slot: below hero fold */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-center">
        <AdsterraDisplayBanner
          size="leaderboard"
          pKey="258fbd7f9475277565c29c04ed1299f6"
        />
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Map className="w-5 h-5 text-indigo-600" /> {translations.explore_world}
        </h2>
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <InteractiveWorldMap cities={cities} lang={lang} />
        </div>
      </section>

      {/* Ad slot: between map and city grid */}
      <div className="max-w-[1400px] mx-auto px-6 py-8 flex justify-center" style={{ minHeight: 250 }}>
        <AdsterraDisplayBanner
          size="medium-rectangle"
          pKey="258fbd7f9475277565c29c04ed1299f6"
        />
      </div>

      <section ref={gridRef} className="max-w-[1400px] mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl font-bold mb-12">{translations.featured_cities}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {regions.map((region: any) => (
            <div key={region.name}>
              <h3 className="text-xl font-black mb-8 uppercase tracking-widest border-l-4 border-indigo-600 pl-4">
                {region.name}
              </h3>
              <div className="space-y-12">
                {region.countries.map((country: any) => (
                  <div key={country.name}>
                    <h4 className="text-xs font-bold mb-4 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                      <span>{COUNTRY_FLAGS[country.name] || '🌍'}</span> {country.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {country.cities.map((city: any) => (
                        <CityCard 
                           key={city.slug} 
                           name={city.name} 
                           country={city.country} 
                           image={city.image} 
                           slug={city.slug} 
                           lang={lang} 
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ad slot: above footer */}
      <div className="max-w-[1400px] mx-auto px-6 py-6 flex justify-center">
        <AdsterraDisplayBanner
          size="leaderboard"
          pKey="258fbd7f9475277565c29c04ed1299f6"
        />
      </div>
    </main>
  )
}