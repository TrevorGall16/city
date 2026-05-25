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
  import AdsterraSmartFrame from '@/components/ads/AdsterraSmartFrame'

  import type { Metadata } from 'next'
  import { CollapsibleSection } from '@/components/ui/CollapsibleSection'
  import { LogisticsSection } from '@/components/features/LogisticsSection'
  import { NeighborhoodSection } from '@/components/features/NeighborhoodSection'
  import { getCityFont } from '@/lib/fonts/cityFonts'
  import { getDict } from '@/data/dictionaries'
  import { LanguageLinks } from '@/components/features/LanguageLinks'
  import { CityNavigation } from '@/components/features/CityNavigation'
  import { CommentThread } from '@/components/features/CommentThread'
  import { ChinaAppGuide } from '@/components/city/ChinaAppGuide'
  import { SurvivalKit } from '@/components/city/SurvivalKit'
  import { MagneticItineraryButton } from '@/components/city/MagneticItineraryButton'
  import { getCityData } from '@/lib/getCityData'
  import { getAvailableLanguages } from '@/lib/getAvailableLanguages'
  import { SEO_DICTIONARY, type SEOLang } from '@/data/seo-dictionary'
  import { isLocale } from '@/data/locales'

  interface PageProps {
    params: Promise<{ lang: string; citySlug: string }>
  }

  export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { citySlug, lang } = await params
    if (!isLocale(lang)) return {}
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

    if (!isLocale(lang)) notFound();

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

    // Pre-compute top places for the Bento board
    const topPlaces = (city.must_see?.flatMap((g: any) => g.items) || []).slice(0, 4)

    return (
      <div className={cityFontClass} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* SEO: TravelGuide Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {faqSchema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          />
        )}

        <main className="min-h-[100dvh] bg-slate-50 dark:bg-slate-950 pb-20">
          <CityNavigation lang={lang} dict={dict} />

          {/* ── 1. ASYMMETRIC HERO ─────────────────────────────────────────── */}
          {/* DESIGN_VARIANCE 5: left-aligned text / right-fading image asset  */}
          <section className="relative min-h-[100dvh] overflow-hidden bg-zinc-950">
            {/* Full-bleed image */}
            <Image
              src={city.hero_image}
              alt={city.name}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />

            {/* Asymmetric gradient: opaque left → transparent right */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-zinc-950/1 pointer-events-none" />
            {/* Bottom fade for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/10 via-transparent to-transparent pointer-events-none" />

            {/* Left-aligned content column */}
            <div className="relative z-10 flex flex-col justify-end min-h-[100dvh] px-6 md:px-16 lg:px-24 pb-16 md:pb-24">
              <div className="max-w-2xl">
                {/* Eyebrow */}
                <span className="block text-[10px] font-black uppercase tracking-[0.45em] text-white/35 mb-8">
                  CityBasic Guide
                </span>

                {/* City name — font-normal: decorative fonts (Modak, Geo, Corinthia) carry their own weight baked in */}
                <h1
                  className={`
                    text-5xl md:text-[15rem] leading-tight tracking-tighter
                    font-normal font-[family-name:var(--font-city)]
                    ${finalHeroColor}
                    drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]
                  `}
                >
                  {city.name}
                </h1>

                {/* Thin rule */}
                <div className="mt-8 w-10 h-[1px] bg-white/25" />

                {/* Vibe subtitle */}
                <p className="mt-6 text-base md:text-lg text-white/55 leading-relaxed max-w-[48ch] font-medium">
                  {introVibe}
                </p>

                {/* Gallery CTA */}
                <Link
                  href={`/${lang}/city/${citySlug}/gallery`}
                  className="
                    mt-10 self-start inline-flex items-center gap-2.5
                    px-5 py-2.5 rounded-xl
                    bg-white/10 hover:bg-white/18
                    backdrop-blur-sm
                    border border-white/10
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                    text-white text-sm font-semibold
                    transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                    active:scale-[0.98]
                  "
                >
                  {/* Inline SVG — server component safe */}
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  {seoStrings.viewGallery}
                </Link>
              </div>
            </div>
          </section>

          {/* ── 2. BENTO BOARD: Survival Kit + Top Places ──────────────────── */}
          {/* Section 9: rounded-[2.5rem], border-slate-200/50, diffusion shadow */}
          <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-14">
            <div className="
              bg-[#f9fafb] dark:bg-zinc-900
              rounded-[2.5rem]
              border border-slate-200/50 dark:border-zinc-800
              shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
              p-2 md:p-3
            ">
              <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-2 md:gap-3">

                {/* Bento card: Survival Kit */}
                <div className="
                  bg-white dark:bg-zinc-950 rounded-[2rem]
                  border border-slate-100 dark:border-zinc-800
                  p-8 md:p-10
                ">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1">
                    Essential Info
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-7">
                    Survival Kit
                  </h2>
                  <SurvivalKit citySlug={citySlug} />
                </div>

                {/* Bento card: Top Places */}
                <div className="
                  bg-white dark:bg-zinc-950 rounded-[2rem]
                  border border-slate-100 dark:border-zinc-800
                  p-8 md:p-10 flex flex-col
                ">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-1">
                    Top Picks
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-7">
                    Must See
                  </h2>

                  <div className="flex-1 divide-y divide-slate-100 dark:divide-zinc-800">
                    {topPlaces.map((place: any, i: number) => (
                      <Link
                        key={place.id || i}
                        href={`/${lang}/city/${citySlug}/${place.slug}`}
                        className="
                          flex items-center justify-between gap-4
                          py-4 group
                          transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
                          active:scale-[0.98]
                        "
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[11px] font-black text-slate-300 dark:text-zinc-600 font-mono w-4 shrink-0">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                            {place.name_en}
                          </span>
                        </div>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="shrink-0 text-slate-300 dark:text-zinc-600 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all duration-200" aria-hidden="true">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/${lang}/city/${citySlug}/lists/sights`}
                    className="
                      mt-6 inline-flex items-center gap-1.5
                      text-[11px] font-black uppercase tracking-[0.15em]
                      text-slate-400 hover:text-slate-700 dark:hover:text-slate-200
                      transition-colors duration-200
                      active:scale-[0.98]
                    "
                  >
                    {seoStrings.viewAllSights}
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

              </div>
            </div>
          </section>

          {/* China Survival Guide */}
          <ChinaAppGuide countryCode={city.country_code} />

          {/* Ad: Top */}
          <div className="my-8 flex justify-center px-4">
            <AdsterraSmartFrame height={250} width={300} pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
          </div>

          {/* ── 3. DASHBOARD ───────────────────────────────────────────────── */}
          <section id="at-a-glance" className="py-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <AtAGlanceDashboard city={city} dict={dict} />
            </div>
          </section>

          {/* ── 4. WEATHER ─────────────────────────────────────────────────── */}
          <section id="weather" className="bg-slate-50 dark:bg-slate-950 py-16 border-b border-slate-100 dark:border-slate-800">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8">
              <SectionHeader title={dict.best_time} countryCode={city.country_code as any} />
              <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mt-12">
                {(city.weather_breakdown || []).map((month, i) => (
                  <MonthCard key={i} month={month} isCurrent={new Date().getMonth() === i} />
                ))}
              </div>
            </div>
          </section>

          {/* ── 5. NEIGHBORHOODS ───────────────────────────────────────────── */}
          {city.neighborhoods && (
            <section
              id="neighborhoods"
              className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto bg-white dark:bg-zinc-900 rounded-[2.5rem] my-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-zinc-800"
            >
              <div className="mb-12">
                <SectionHeader title={dict.neighborhoods_stay || dict.neighborhoods} countryCode={city.country_code as any} />
              </div>
              <NeighborhoodSection neighborhoods={city.neighborhoods} dict={dict} cityName={city.name} />
            </section>
          )}

          {/* Ad: Mid-page */}
          <div className="my-12 max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="w-full flex justify-center py-8 border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-zinc-900/30 rounded-2xl">
              <AdsterraSmartFrame height={250} width={300} pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
            </div>
          </div>

          {/* ── 6. CULTURE ─────────────────────────────────────────────────── */}
          {city.culture && (
            <section id="culture" className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto">
              <SectionHeader title={dict.culture} countryCode={city.country_code as any} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
                <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xl font-black text-emerald-600 mb-8 uppercase tracking-tighter">Dos &amp; Don'ts</h3>
                  <ul className="space-y-5">
                    {(city.culture.etiquette_tips || []).map((tip: string, i: number) => (
                      <li key={i} className="flex gap-4 items-start text-slate-600 dark:text-slate-300 font-medium text-base">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-zinc-800 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]">
                  <h3 className="text-xl font-black text-slate-700 dark:text-slate-200 mb-8 uppercase tracking-tighter">Key Phrases</h3>
                  <div className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {(city.culture.essential_phrases || []).map((phrase: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-4">
                        <span className="text-base font-semibold text-slate-700 dark:text-slate-300">{phrase.src}</span>
                        <div className="text-right">
                          <span className="block text-lg font-black text-slate-900 dark:text-slate-100">{phrase.local}</span>
                          <span className="block text-xs text-slate-400 font-bold uppercase tracking-widest italic">{phrase.phonetic}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── 7. ITINERARIES — Asymmetric Magnetic Grid ──────────────────── */}
          {/* DESIGN_VARIANCE 8: 2fr+1fr grid, not 3 equal columns (BANNED)    */}
          <section id="itineraries" className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="mb-12">
              <SectionHeader title={seoStrings.perfectItineraries} countryCode={city.country_code as any} />
            </div>

            {/* Balanced 3-column grid — consistent height across all cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MagneticItineraryButton
                href={`/${lang}/city/${citySlug}/itinerary/1-day`}
                dayNumber="1"
                dayLabel={seoStrings.day1}
                dayDesc={seoStrings.quickTrip}
                accentClass="bg-emerald-500"
                checkLabel="Check Itinerary"
              />
              <MagneticItineraryButton
                href={`/${lang}/city/${citySlug}/itinerary/2-days`}
                dayNumber="2"
                dayLabel={seoStrings.day2}
                dayDesc={seoStrings.weekendGetaway}
                accentClass="bg-amber-500"
                checkLabel="Check Itinerary"
              />
              <MagneticItineraryButton
                href={`/${lang}/city/${citySlug}/itinerary/3-days`}
                dayNumber="3"
                dayLabel={seoStrings.day3}
                dayDesc={seoStrings.fullExperience}
                accentClass="bg-rose-500"
                checkLabel="Check Itinerary"
              />
            </div>
          </section>

          {/* Ad: Wide banner */}
          <div className="my-10 flex justify-center max-w-[1400px] mx-auto px-4 md:px-8">
            <AdsterraSmartFrame height={90} width={728} pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
          </div>

          {/* ── 8. ATTRACTIONS ─────────────────────────────────────────────── */}
          <section id="must-see" className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="mb-12">
              <SectionHeader title={dict.attractions} countryCode={city.country_code as any} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderPlacesWithAds(city.must_see?.flatMap((g: any) => g.items) || [], dict)}
            </div>
            <div className="mt-12">
              <Link
                href={`/${lang}/city/${citySlug}/lists/sights`}
                className="
                  inline-flex items-center gap-2
                  px-7 py-3.5 rounded-xl
                  bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white
                  text-white dark:text-zinc-900
                  text-sm font-bold
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  shadow-[0_8px_24px_-6px_rgba(0,0,0,0.15)]
                  active:scale-[0.98]
                "
              >
                {seoStrings.viewAllSights}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ── 9. TRAVEL ESSENTIALS ───────────────────────────────────────── */}
          {city.affiliate_products && (
            <section id="essentials" className="py-20 px-4 md:px-8 max-w-[1400px] mx-auto border-y border-slate-100 dark:border-zinc-800">
              <div className="mb-12">
                <SectionHeader title={dict.travel_essentials} countryCode={city.country_code as any} />
              </div>
              <AffiliateSection
                products={city.affiliate_products}
                countryCode={city.country_code}
                cityName={city.name}
              />
            </section>
          )}

          {/* Ad: Wide banner */}
          <div className="my-10 flex justify-center max-w-[1400px] mx-auto px-4 md:px-8">
            <AdsterraSmartFrame height={90} width={728} pKey="81531fc7e6a8cf5cc6de9e368b8f2c11" />
          </div>

          {/* ── 10. FOOD ───────────────────────────────────────────────────── */}
          <section id="food" className="py-16 px-4 md:px-8 max-w-[1400px] mx-auto">
            <div className="mb-12">
              <SectionHeader title={dict.must_eat} countryCode={city.country_code as any} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {renderPlacesWithAds(city.must_eat || [], dict)}
            </div>
            <div className="mt-12">
              <Link
                href={`/${lang}/city/${citySlug}/lists/food`}
                className="
                  inline-flex items-center gap-2
                  px-7 py-3.5 rounded-xl
                  bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white
                  text-white dark:text-zinc-900
                  text-sm font-bold
                  transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                  shadow-[0_8px_24px_-6px_rgba(0,0,0,0.15)]
                  active:scale-[0.98]
                "
              >
                {seoStrings.viewAllFood}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          {/* ── 11. 24H ITINERARY TIMELINE ─────────────────────────────────── */}
          {city.itinerary && (
            <section className="py-24 px-4 md:px-8 max-w-[900px] mx-auto">
              <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tighter uppercase">
                {dict.perfect_24h} {city.name}
              </h2>
              <div className="border-l border-slate-200 dark:border-zinc-800 ml-4 space-y-16 pl-1">
                {city.itinerary.map((stop: any, idx: number) => {
                  const rawDesc = stop.description as any
                  const stopDesc =
                    typeof rawDesc === 'object'
                      ? rawDesc.description || rawDesc.short || rawDesc.long || ''
                      : rawDesc || ''
                  return (
                    <div key={idx} className="pl-10 relative group">
                      <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-zinc-600 ring-4 ring-slate-50 dark:ring-zinc-950 transition-all group-hover:bg-emerald-500 group-hover:ring-emerald-100 dark:group-hover:ring-emerald-950" />
                      <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                        {stop.time}
                      </span>
                      <h3 className="text-2xl font-black mt-2 tracking-tight text-slate-900 dark:text-white">
                        {stop.title}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 mt-4 leading-relaxed text-base max-w-[65ch]">
                        {stopDesc}
                      </p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* ── 12. LOGISTICS ──────────────────────────────────────────────── */}
          <section id="logistics" className="max-w-[1400px] mx-auto py-24 px-4">
            <CollapsibleSection title={dict.practical_logistics}>
              <LogisticsSection
                topics={
                  Array.isArray(city.logistics)
                    ? city.logistics
                    : city.logistics
                    ? [city.logistics]
                    : []
                }
              />
            </CollapsibleSection>
          </section>

          <section className="max-w-[1400px] mx-auto px-4 py-12 border-t border-slate-100 dark:border-zinc-900">
            <LanguageLinks
              citySlug={citySlug}
              currentLang={lang}
              availableLanguages={getAvailableLanguages(citySlug)}
            />
          </section>

          <section className="max-w-[900px] mx-auto px-4 py-24 border-t border-slate-200 dark:border-zinc-800">
            <CommentThread citySlug={citySlug} lang={lang} dict={dict} />
          </section>
        </main>
      </div>
    )
  }