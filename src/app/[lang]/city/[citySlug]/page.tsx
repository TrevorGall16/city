/**
 * 🛰️ MASTER AI: CITY SHEET GOLDEN MASTER (V7.0 - NO CACHE)
 * ✅ Fixed: Removed missing cache import (Fixes build error).
 * ✅ Preserved: Crash protection for intro_vibe (String/Object).
 * ✅ Preserved: Adsterra/Virus disabled.
 * ✅ Preserved: Itinerary crash protection.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import { MonthCard } from '@/components/features/MonthCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AtAGlanceDashboard } from '@/components/features/AtAGlanceDashboard'
import { AffiliateSection } from '@/components/features/AffiliateSection' 
import AdsterraBanner from '@/components/ads/AdsterraBanner'
// import AdsterraNative from '@/components/ads/AdsterraNative' // 🛡️ Disabled for Safety

import type { Metadata } from 'next'
import { HeroGlass } from '@/components/ui/HeroGlass'
import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
import { LogisticsSection } from '@/components/features/LogisticsSection'
import { NeighborhoodSection } from '@/components/features/NeighborhoodSection'
import { getCityFont } from '@/lib/fonts/cityFonts'
import { getDict } from '@/data/dictionaries'
import { LanguageLinks } from '@/components/features/LanguageLinks'
import { CityNavigation } from '@/components/features/CityNavigation'
import { CommentThread } from '@/components/features/CommentThread'

// 🛑 REMOVED CACHE IMPORT

interface PageProps {
  params: Promise<{ lang: string; citySlug: string }>
}

const SUPPORTED_LANGS = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

async function getCityData(slug: string, lang: string) {
  try {
    const fileName = lang === 'en' ? `${slug}.json` : `${slug}-${lang}.json`;
    const filePath = path.join(process.cwd(), 'src/data/cities', fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent) as City;
  } catch (error) {
    try {
      // Fallback to English if localized file is corrupt or missing
      const fallbackPath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`);
      const fallbackContent = await fs.readFile(fallbackPath, 'utf8');
      return JSON.parse(fallbackContent) as City;
    } catch { return null; }
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, lang } = await params
  const city = await getCityData(citySlug, lang)
  const dict = getDict(lang) 
  if (!city) return { title: 'City Not Found' }
  return { title: `${city.name} | ${dict.seo_travel_guide_suffix || 'Travel Guide 2026'}` }
}

export default async function CityPage({ params }: PageProps) {
  // 🎯 NAVIGATION LOCK: Await params at the start
  const resolvedParams = await params;
  const { citySlug, lang } = resolvedParams;
  
  const city = await getCityData(citySlug, lang);
  const dict = getDict(lang);

  if (!city) notFound()

  // 🛡️ MASTER AI CRASH PROTECTION
  // We added '.description' to the check list to match your localized JSON format.
  const rawVibe = city.intro_vibe as any; 
  const introVibe = typeof rawVibe === 'object' 
    ? (rawVibe.description || rawVibe.short || rawVibe.long || '') 
    : (rawVibe || '');

  const cityFontClass = getCityFont(citySlug)
  const CITY_COLOR_OVERRIDES: Record<string, string> = {
    'bangkok': 'text-yellow-400', 'hong-kong': 'text-red-600', 'tokyo': 'text-sky-400',
    'london': 'text-red-600', 'paris': 'text-white', 'rome': 'text-green-500'
  }
  const finalHeroColor = CITY_COLOR_OVERRIDES[citySlug] || 'text-white'

  const renderPlacesWithAds = (places: any[], dict: any) => {
    return (places || []).map((place: any, index: number) => (
      <div key={place.id || `place-${index}`}>
        <EnhancedPlaceCard place={place} citySlug={citySlug} lang={lang} dict={dict} />
        {index === 2 && (
          <div className="col-span-full py-6 flex justify-center">
             {/* 🛡️ Virus Script Removed */}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className={cityFontClass} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
        <CityNavigation lang={lang} dict={dict} />

        {/* 1. Cinematic Hero */}
        <section className="h-[60vh] relative overflow-hidden group">
          <Image src={city.hero_image} alt={city.name} fill priority className="object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
            {/* ✅ Fixed: Now correctly grabs 'description' from object */}
            <HeroGlass title={city.name} subtitle={introVibe} titleColor={finalHeroColor} fontClass={cityFontClass} />
          </div>
        </section>

        {/* 2. Dashboard Section */}
        <section id="at-a-glance" className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <AtAGlanceDashboard city={city} dict={dict} />
          </div>
        </section>

        {/* 3. Weather Section */}
        <section id="weather" className="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-100 dark:border-slate-800">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8">
            <SectionHeader title={dict.best_time} countryCode={city.country_code as any} />
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-12">
              {(city.weather_breakdown || []).map((month, i) => (
                <MonthCard key={i} month={month} isCurrent={new Date().getMonth() === i} />
              ))}
            </div>
          </div>
        </section>

        {/* 4. Neighborhoods */}
        {city.neighborhoods && (
          <section id="neighborhoods" className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto bg-white dark:bg-slate-900 rounded-[3rem] my-12 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="mb-12"><SectionHeader title={dict.neighborhoods_stay || dict.neighborhoods} countryCode={city.country_code as any} /></div>
            <NeighborhoodSection neighborhoods={city.neighborhoods} dict={dict} cityName={city.name} />
          </section>
        )}

        {/* 5. Culture Section */}
        {city.culture && (
          <section id="culture" className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionHeader title={dict.culture} countryCode={city.country_code as any} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-2xl font-black text-indigo-600 mb-8 uppercase tracking-tighter">Dos & Don'ts</h3>
                <ul className="space-y-6">
                  {(city.culture.etiquette_tips || []).map((tip: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start text-slate-700 dark:text-slate-300 font-medium text-lg">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 flex-shrink-0" /> {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
                <h3 className="text-2xl font-black text-emerald-600 mb-8 uppercase tracking-tighter">Key Phrases</h3>
                <div className="grid gap-6">
                  {(city.culture.essential_phrases || []).map((phrase: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <span className="text-xl font-bold">{phrase.src}</span>
                      <div className="text-right">
                        <span className="block text-2xl font-black text-slate-700 dark:text-slate-200">{phrase.local}</span>
                        <span className="block text-sm text-indigo-500 font-bold uppercase tracking-widest italic">{phrase.phonetic}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6. Attractions & Food Grid */}
        <section id="must-see" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
           <div className="mb-12"><SectionHeader title={dict.attractions} countryCode={city.country_code as any} /></div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {renderPlacesWithAds(city.must_see?.flatMap((g: any) => g.items) || [], dict)}
           </div>
        </section>

        {/* 7. Travel Essentials (Affiliates) */}
        {city.affiliate_products && (
          <section id="essentials" className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800">
            <div className="mb-12"><SectionHeader title={dict.travel_essentials} countryCode={city.country_code as any} /></div>
            <AffiliateSection 
              products={city.affiliate_products} 
              countryCode={city.country_code} 
              cityName={city.name} 
            />
          </section>
        )}

        <section id="food" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
           <div className="mb-12"><SectionHeader title={dict.must_eat} countryCode={city.country_code as any} /></div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {renderPlacesWithAds(city.must_eat || [], dict)}
           </div>
        </section>

        {/* 8. Itinerary Section */}
        {city.itinerary && (
          <section className="py-24 px-4 md:px-8 max-w-[1000px] mx-auto">
            <h2 className="text-5xl font-black mb-16 text-center tracking-tighter uppercase">{dict.perfect_24h} {city.name}</h2>
            <div className="border-l-4 border-indigo-500/20 ml-6 space-y-20">
              {city.itinerary.map((stop: any, idx: number) => {
                // ✅ Safe description check with .description fallback
                const rawDesc = stop.description as any;
                const stopDesc = typeof rawDesc === 'object' 
                  ? (rawDesc.description || rawDesc.short || rawDesc.long || '') 
                  : (rawDesc || '');

                return (
                  <div key={idx} className="pl-14 relative group">
                    <div className="absolute -left-[18px] top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-indigo-600 transition-all group-hover:scale-125" />
                    <span className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">{stop.time}</span>
                    <h3 className="text-3xl font-black mt-2 tracking-tight">{stop.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mt-6 leading-relaxed text-xl font-medium italic">"{stopDesc}"</p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 9. Logistics */}
        <section id="logistics" className="max-w-[1600px] mx-auto py-24 px-4">
          <CollapsibleSection title={dict.practical_logistics}>
            <LogisticsSection 
              topics={
                Array.isArray(city.logistics) 
                  ? city.logistics 
                  : city.logistics ? [city.logistics] : []
              } 
            />
          </CollapsibleSection>
        </section>

        <section className="max-w-[1600px] mx-auto px-4 py-12 border-t border-slate-100 dark:border-slate-900">
            <LanguageLinks citySlug={citySlug} currentLang={lang} />
        </section>

        <section className="max-w-[1000px] mx-auto px-4 py-24 border-t-4 border-slate-900 dark:border-slate-100">
            <CommentThread citySlug={citySlug} dict={dict} />
        </section>
      </main>
    </div>
  );
}