/**
   * 🛰️ MASTER AI: CITY SHEET GOLDEN MASTER (V7.2 - MULTILINGUAL SEO)
   * ✅ Added: SEO Translation Dictionary for 8 languages
   * ✅ Enhanced: Fully localized meta descriptions and titles
   * ✅ Preserved: All features (Ads, Itinerary, Crash Protection)
   */

  import { notFound } from 'next/navigation'
  import Image from 'next/image'
  import Link from 'next/link'
  import type { City } from '@/types'
  import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
  import { MonthCard } from '@/components/features/MonthCard'
  import { SectionHeader } from '@/components/ui/SectionHeader'
  import { AtAGlanceDashboard } from '@/components/features/AtAGlanceDashboard'
  import { AffiliateSection } from '@/components/features/AffiliateSection'
  import AdsterraBanner from '@/components/ads/AdsterraBanner'
  import AdsterraSmartFrame from '@/components/ads/AdsterraSmartFrame'
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
  import { ChinaAppGuide } from '@/components/city/ChinaAppGuide'
  import { getCityData } from '@/lib/getCityData'
  import { SEO_DICTIONARY, type SEOLang } from '@/data/seo-dictionary'

  interface PageProps {
    params: Promise<{ lang: string; citySlug: string }>
  }

  const SUPPORTED_LANGS = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'ar']

  export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { citySlug, lang } = await params
    const city = await getCityData(citySlug, lang)
    const dict = getDict(lang)
    if (!city) return { title: 'City Not Found' }

    // 🌍 Get localized SEO strings (with fallback to English)
    const seoLang = (lang in SEO_DICTIONARY ? lang : 'en') as SEOLang
    const seoStrings = SEO_DICTIONARY[seoLang]

    // 🎯 SEO: Dynamic meta description (no JSON field needed)
    const rawVibe = city.intro_vibe as any
    const introVibe = typeof rawVibe === 'object'
      ? (rawVibe.description || rawVibe.short || rawVibe.long || '')
      : (rawVibe || '')

    // Extract top 2 attractions for description
    const topAttractions = city.must_see?.flatMap((g: any) => g.items).slice(0, 2) || []
    const attractionNames = topAttractions
      .map((item: any) => item.name_en)
      .filter(Boolean)

    // Build localized description
    const description = attractionNames.length >= 2
      ? `${introVibe} ${seoStrings.topSightsInclude} ${attractionNames[0]} ${seoStrings.and} ${attractionNames[1]}.`
      : attractionNames.length === 1
      ? `${introVibe} ${seoStrings.topSightsInclude} ${attractionNames[0]}.`
      : introVibe

    // Build localized title
    const currentYear = new Date().getFullYear()
    const pageTitle = `${city.name} | ${seoStrings.travelGuide} ${currentYear}`
    const ogTitle = `${city.name} ${seoStrings.travelGuide}`

    return {
      title: pageTitle,
      description: description.slice(0, 160), // SEO best practice: 160 char limit
      alternates: {
    canonical: `https://citybasic.com/${lang}/city/${citySlug}`,
    languages: {
      'en': `https://citybasic.com/en/city/${citySlug}`,
      'fr': `https://citybasic.com/fr/city/${citySlug}`,
      'es': `https://citybasic.com/es/city/${citySlug}`,
      'it': `https://citybasic.com/it/city/${citySlug}`,
      'ja': `https://citybasic.com/ja/city/${citySlug}`,
      'hi': `https://citybasic.com/hi/city/${citySlug}`,
      'de': `https://citybasic.com/de/city/${citySlug}`,
      'zh': `https://citybasic.com/zh/city/${citySlug}`,
      'ar': `https://citybasic.com/ar/city/${citySlug}`,
    },
  },
      openGraph: {
        title: ogTitle,
        description: description.slice(0, 160),
        images: [city.hero_image],
        url: `https://citybasic.com/${lang}/city/${citySlug}`,
        locale: lang === 'en' ? 'en_US' : lang === 'fr' ? 'fr_FR' : lang === 'es' ? 'es_ES' : lang === 'de' ? 'de_DE' : lang === 'it' ? 'it_IT' : lang === 'ja' ? 'ja_JP' : lang === 'hi' ? 'hi_IN' : lang === 'ar' ? 'ar_AR' : 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: ogTitle,
        description: description.slice(0, 160),
        images: [city.hero_image],
      },
    }
  }

  export default async function CityPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { citySlug, lang } = resolvedParams;

    const city = await getCityData(citySlug, lang);
    const dict = getDict(lang);
    const seoLang = (lang in SEO_DICTIONARY ? lang : 'en') as SEOLang;
    const seoStrings = SEO_DICTIONARY[seoLang];

    if (!city) notFound()

    // 🛡️ MASTER AI CRASH PROTECTION
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

    // 🎯 SEO: JSON-LD Structured Data (Kept from other AI)
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'TravelGuide',
      name: `${city.name} Travel Guide`,
      description: introVibe || `Complete travel guide for ${city.name}`,
      url: `https://citybasic.com/${lang}/city/${citySlug}`,
      inLanguage: lang,
      about: {
        '@type': 'City',
        name: city.name,
        description: introVibe,
        image: city.hero_image,
        geo: city.lat && city.lng ? {
          '@type': 'GeoCoordinates',
          latitude: city.lat,
          longitude: city.lng
        } : undefined,
        containedInPlace: {
          '@type': 'Country',
          name: city.country,
        },
      },
      touristAttraction: [
        ...(city.must_see?.flatMap((section: any) =>
          section.items?.map((place: any) => ({
            '@type': 'TouristAttraction',
            name: place.name_en,
            description: typeof place.description === 'string'
              ? place.description
              : place.description?.short || '',
            image: place.image,
            url: `https://citybasic.com/${lang}/city/${citySlug}/${place.slug}`,
          })) || []
        ) || []),
        ...(city.must_eat?.map((place: any) => ({
          '@type': 'Restaurant',
          name: place.name_en,
          description: typeof place.description === 'string'
            ? place.description
            : place.description?.short || '',
          image: place.image,
          servesCuisine: city.name,
        })) || []),
      ].filter(Boolean).slice(0, 10),
    }

    // 🎯 SEO: FAQPage Schema for "Zero-Click" Rich Results
    const logisticsItems = Array.isArray(city.logistics) ? city.logistics : [];
    const faqSchema = logisticsItems.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: logisticsItems.map((item: any) => {
        // Build answer: summary + first 2 detail points
        const details = Array.isArray(item.details) ? item.details.slice(0, 2) : [];
        const answerText = [
          item.summary || '',
          ...details
        ].filter(Boolean).join(' ');

        return {
          '@type': 'Question',
          name: `${item.title} in ${city.name}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerText,
          },
        };
      }),
    } : null;

    return (
      <div className={cityFontClass} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* 🎯 SEO Injection: TravelGuide Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* 🎯 SEO Injection: FAQPage Schema for Zero-Click */}
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
          <CityNavigation lang={lang} dict={dict} />

          {/* 1. Cinematic Hero */}
          <section className="h-[60vh] relative overflow-hidden group">
            <Image src={city.hero_image} alt={city.name} fill priority sizes="(max-width: 768px) 100vw, 100vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
              <HeroGlass title={city.name} subtitle={introVibe} titleColor={finalHeroColor} fontClass={cityFontClass} />
            </div>
            {/* Gallery Floating Button */}
            <Link
              href={`/${lang}/city/${citySlug}/gallery`}
              className="absolute bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 text-slate-900 dark:text-white font-semibold text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {seoStrings.viewGallery}
            </Link>
          </section>

          {/* China Survival Guide (only renders for cn cities) */}
          <ChinaAppGuide countryCode={city.country_code} />

          {/* Ad Placement 1: Top */}
          <div className="my-8 flex justify-center">
            <AdsterraSmartFrame
              height={250}
              width={300}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>

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

          {/* Ad Placement 2: Mid-page */}
          <div className="my-12 flex justify-center max-w-[1600px] mx-auto px-4 md:px-8">
            <div className="w-full flex justify-center py-8 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl">
              <AdsterraSmartFrame
                height={250}
                width={300}
                pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
              />
            </div>
          </div>

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

          {/* 6. Perfect Itineraries Section */}
          <section id="itineraries" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="mb-12"><SectionHeader title={seoStrings.perfectItineraries} countryCode={city.country_code as any} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1 Day Card */}
              <Link
                href={`/${lang}/city/${citySlug}/itinerary/1-day`}
                className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 to-orange-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
              >
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-black">1</span>
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-black tracking-tight">{seoStrings.day1}</h3>
                  <p className="mt-2 text-white/80 font-medium">{seoStrings.quickTrip}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Itinerary</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>

              {/* 2 Days Card */}
              <Link
                href={`/${lang}/city/${citySlug}/itinerary/2-days`}
                className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
              >
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-black">2</span>
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-black tracking-tight">{seoStrings.day2}</h3>
                  <p className="mt-2 text-white/80 font-medium">{seoStrings.weekendGetaway}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Itinerary</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>

              {/* 3 Days Card */}
              <Link
                href={`/${lang}/city/${citySlug}/itinerary/3-days`}
                className="group relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
              >
                <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-black">3</span>
                </div>
                <div className="mt-12">
                  <h3 className="text-3xl font-black tracking-tight">{seoStrings.day3}</h3>
                  <p className="mt-2 text-white/80 font-medium">{seoStrings.fullExperience}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View Itinerary</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </div>
          </section>

          {/* Ad Placement 3: Wide banner above Attractions */}
          <div className="my-10 flex justify-center max-w-[1600px] mx-auto px-4 md:px-8">
            <AdsterraSmartFrame
              height={90}
              width={728}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>

          {/* 7. Attractions & Food Grid */}
          <section id="must-see" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
             <div className="mb-12"><SectionHeader title={dict.attractions} countryCode={city.country_code as any} /></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {renderPlacesWithAds(city.must_see?.flatMap((g: any) => g.items) || [], dict)}
             </div>
             <div className="mt-12 text-center">
               <Link
                 href={`/${lang}/city/${citySlug}/lists/sights`}
                 className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-xl"
               >
                 {seoStrings.viewAllSights}
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </Link>
             </div>
          </section>

          {/* 8. Travel Essentials (Affiliates) */}
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

          {/* Ad Placement 4: Wide banner above Food */}
          <div className="my-10 flex justify-center max-w-[1600px] mx-auto px-4 md:px-8">
            <AdsterraSmartFrame
              height={90}
              width={728}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>

          <section id="food" className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
             <div className="mb-12"><SectionHeader title={dict.must_eat} countryCode={city.country_code as any} /></div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {renderPlacesWithAds(city.must_eat || [], dict)}
             </div>
             <div className="mt-12 text-center">
               <Link
                 href={`/${lang}/city/${citySlug}/lists/food`}
                 className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg hover:shadow-xl"
               >
                 {seoStrings.viewAllFood}
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                 </svg>
               </Link>
             </div>
          </section>

          {/* 9. Daily Itinerary Timeline */}
          {city.itinerary && (
            <section className="py-24 px-4 md:px-8 max-w-[1000px] mx-auto">
              <h2 className="text-5xl font-black mb-16 text-center tracking-tighter uppercase">{dict.perfect_24h} {city.name}</h2>
              <div className="border-l-4 border-indigo-500/20 ml-6 space-y-20">
                {city.itinerary.map((stop: any, idx: number) => {
                  // ✅ Safe description check
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

          {/* 10. Logistics */}
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