/**
 * Itinerary Cheat Sheet Page - Time-Based Trip Planning
 * Routes: /[lang]/city/[citySlug]/itinerary/1-day | 2-days | 3-days
 * Purpose: Rank for keywords like "1 Day in Paris" or "3 Days in Tokyo Itinerary"
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { City, Place } from '@/types'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import { getDict } from '@/data/dictionaries'
import { getCityData } from '@/lib/getCityData'

// ============================================================================
// LOCAL TRANSLATION DICTIONARY
// ============================================================================
const ITINERARY_DICT = {
  en: {
    title_1day: '1 Day in',
    title_2days: '2 Days in',
    title_3days: '3 Days in',
    subtitle: 'Your Perfect Itinerary',
    description_1day: 'Make the most of 24 hours with this curated itinerary for',
    description_2days: 'The perfect 2-day itinerary to explore the best of',
    description_3days: 'A comprehensive 3-day guide to experiencing everything',
    back_to_city: 'Back to City Guide',
    must_see_section: 'Must-See Attractions',
    must_eat_section: 'Must-Eat Spots',
    items_count: 'stops',
    other_durations: 'Other Itineraries',
    day_1: '1 Day',
    day_2: '2 Days',
    day_3: '3 Days',
  },
  fr: {
    title_1day: '1 Jour à',
    title_2days: '2 Jours à',
    title_3days: '3 Jours à',
    subtitle: 'Votre Itinéraire Parfait',
    description_1day: 'Profitez au maximum de 24 heures avec cet itinéraire pour',
    description_2days: 'L\'itinéraire parfait de 2 jours pour explorer le meilleur de',
    description_3days: 'Un guide complet de 3 jours pour tout découvrir à',
    back_to_city: 'Retour au Guide',
    must_see_section: 'Attractions Incontournables',
    must_eat_section: 'Restaurants Incontournables',
    items_count: 'étapes',
    other_durations: 'Autres Itinéraires',
    day_1: '1 Jour',
    day_2: '2 Jours',
    day_3: '3 Jours',
  },
  es: {
    title_1day: '1 Día en',
    title_2days: '2 Días en',
    title_3days: '3 Días en',
    subtitle: 'Tu Itinerario Perfecto',
    description_1day: 'Aprovecha al máximo 24 horas con este itinerario para',
    description_2days: 'El itinerario perfecto de 2 días para explorar lo mejor de',
    description_3days: 'Una guía completa de 3 días para experimentar todo en',
    back_to_city: 'Volver a la Guía',
    must_see_section: 'Atracciones Imprescindibles',
    must_eat_section: 'Restaurantes Imprescindibles',
    items_count: 'paradas',
    other_durations: 'Otros Itinerarios',
    day_1: '1 Día',
    day_2: '2 Días',
    day_3: '3 Días',
  },
  it: {
    title_1day: '1 Giorno a',
    title_2days: '2 Giorni a',
    title_3days: '3 Giorni a',
    subtitle: 'Il Tuo Itinerario Perfetto',
    description_1day: 'Sfrutta al massimo 24 ore con questo itinerario per',
    description_2days: 'L\'itinerario perfetto di 2 giorni per esplorare il meglio di',
    description_3days: 'Una guida completa di 3 giorni per vivere tutto a',
    back_to_city: 'Torna alla Guida',
    must_see_section: 'Attrazioni Imperdibili',
    must_eat_section: 'Ristoranti Imperdibili',
    items_count: 'tappe',
    other_durations: 'Altri Itinerari',
    day_1: '1 Giorno',
    day_2: '2 Giorni',
    day_3: '3 Giorni',
  },
  de: {
    title_1day: '1 Tag in',
    title_2days: '2 Tage in',
    title_3days: '3 Tage in',
    subtitle: 'Dein Perfekter Reiseplan',
    description_1day: 'Nutze 24 Stunden optimal mit diesem Reiseplan für',
    description_2days: 'Der perfekte 2-Tage-Reiseplan für das Beste von',
    description_3days: 'Ein umfassender 3-Tage-Guide für alles in',
    back_to_city: 'Zurück zum Reiseführer',
    must_see_section: 'Must-See Attraktionen',
    must_eat_section: 'Must-Eat Restaurants',
    items_count: 'Stationen',
    other_durations: 'Andere Reisepläne',
    day_1: '1 Tag',
    day_2: '2 Tage',
    day_3: '3 Tage',
  },
  ja: {
    title_1day: '1日で巡る',
    title_2days: '2日で巡る',
    title_3days: '3日で巡る',
    subtitle: 'パーフェクト旅程',
    description_1day: '24時間を最大限に活用するおすすめコース',
    description_2days: '2日間で最高の体験ができる完璧なコース',
    description_3days: '3日間ですべてを体験する完全ガイド',
    back_to_city: 'シティガイドに戻る',
    must_see_section: '必見スポット',
    must_eat_section: '必食グルメ',
    items_count: 'スポット',
    other_durations: '他のコース',
    day_1: '1日',
    day_2: '2日',
    day_3: '3日',
  },
  zh: {
    title_1day: '1天玩转',
    title_2days: '2天玩转',
    title_3days: '3天玩转',
    subtitle: '完美行程',
    description_1day: '24小时精选行程，充分利用每一刻',
    description_2days: '2天完美行程，探索最佳景点',
    description_3days: '3天全面攻略，体验一切精彩',
    back_to_city: '返回城市指南',
    must_see_section: '必看景点',
    must_eat_section: '必吃美食',
    items_count: '个地点',
    other_durations: '其他行程',
    day_1: '1天',
    day_2: '2天',
    day_3: '3天',
  },
  hi: {
    title_1day: '1 दिन में',
    title_2days: '2 दिन में',
    title_3days: '3 दिन में',
    subtitle: 'आपका परफेक्ट यात्रा कार्यक्रम',
    description_1day: '24 घंटे का अधिकतम लाभ उठाएं इस यात्रा कार्यक्रम के साथ',
    description_2days: '2 दिन की परफेक्ट यात्रा योजना',
    description_3days: '3 दिन की व्यापक गाइड सब कुछ अनुभव करने के लिए',
    back_to_city: 'सिटी गाइड पर वापस जाएं',
    must_see_section: 'अवश्य देखें',
    must_eat_section: 'अवश्य खाएं',
    items_count: 'स्थान',
    other_durations: 'अन्य यात्रा कार्यक्रम',
    day_1: '1 दिन',
    day_2: '2 दिन',
    day_3: '3 दिन',
  },
  ar: {
    title_1day: 'يوم واحد في',
    title_2days: 'يومان في',
    title_3days: '3 أيام في',
    subtitle: 'برنامجك المثالي',
    description_1day: 'استفد من 24 ساعة مع هذا البرنامج المنتقى لـ',
    description_2days: 'البرنامج المثالي ليومين لاستكشاف أفضل ما في',
    description_3days: 'دليل شامل لـ 3 أيام لتجربة كل شيء في',
    back_to_city: 'العودة إلى دليل المدينة',
    must_see_section: 'معالم يجب زيارتها',
    must_eat_section: 'مطاعم يجب تجربتها',
    items_count: 'محطة',
    other_durations: 'برامج أخرى',
    day_1: 'يوم واحد',
    day_2: 'يومان',
    day_3: '3 أيام',
  },
} as const

type SupportedLang = keyof typeof ITINERARY_DICT
type ValidDuration = '1-day' | '2-days' | '3-days'

const VALID_DURATIONS: ValidDuration[] = ['1-day', '2-days', '3-days']

// Duration configuration: how many items to show for each duration
const DURATION_CONFIG: Record<ValidDuration, { mustSee: number; mustEat: number }> = {
  '1-day': { mustSee: 3, mustEat: 2 },
  '2-days': { mustSee: 6, mustEat: 4 },
  '3-days': { mustSee: 10, mustEat: 6 },
}

// ============================================================================
// DATA FETCHING
// ============================================================================
interface PageProps {
  params: Promise<{ lang: string; citySlug: string; duration: string }>
}

function isValidDuration(duration: string): duration is ValidDuration {
  return VALID_DURATIONS.includes(duration as ValidDuration)
}

function flattenMustSee(city: City): Place[] {
  const groups = city.must_see || []
  return groups.flatMap((group: { items?: Place[] }) => group.items || [])
}

function getItineraryItems(
  city: City,
  duration: ValidDuration
): { mustSee: Place[]; mustEat: Place[] } {
  const config = DURATION_CONFIG[duration]
  const allMustSee = flattenMustSee(city)
  const allMustEat = city.must_eat || []

  return {
    mustSee: allMustSee.slice(0, config.mustSee),
    mustEat: allMustEat.slice(0, config.mustEat),
  }
}

// ============================================================================
// METADATA GENERATION
// ============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, lang, duration } = await params

  if (!isValidDuration(duration)) {
    return { title: 'Not Found' }
  }

  const city = await getCityData(citySlug, lang)
  if (!city) {
    return { title: 'City Not Found' }
  }

  const dictLang = (lang in ITINERARY_DICT ? lang : 'en') as SupportedLang
  const localDict = ITINERARY_DICT[dictLang]

  const isAsianLang = ['ja', 'zh', 'hi', 'ar'].includes(lang)

  const durationTitles: Record<ValidDuration, string> = {
    '1-day': localDict.title_1day,
    '2-days': localDict.title_2days,
    '3-days': localDict.title_3days,
  }

  const durationDescs: Record<ValidDuration, string> = {
    '1-day': localDict.description_1day,
    '2-days': localDict.description_2days,
    '3-days': localDict.description_3days,
  }

  const titlePrefix = durationTitles[duration]
  const descPrefix = durationDescs[duration]

  const pageTitle = isAsianLang
    ? `${titlePrefix}${city.name} | ${localDict.subtitle}`
    : `${titlePrefix} ${city.name} | ${localDict.subtitle}`

  const { mustSee, mustEat } = getItineraryItems(city, duration)
  const totalStops = mustSee.length + mustEat.length

  const description = isAsianLang
    ? `${city.name} ${descPrefix} - ${totalStops}${localDict.items_count}`
    : `${descPrefix} ${city.name}. ${totalStops} ${localDict.items_count} curated for you.`

  return {
    title: pageTitle,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://citybasic.com/${lang}/city/${citySlug}/itinerary/${duration}`,
      languages: {
        'en': `https://citybasic.com/en/city/${citySlug}/itinerary/${duration}`,
        'fr': `https://citybasic.com/fr/city/${citySlug}/itinerary/${duration}`,
        'es': `https://citybasic.com/es/city/${citySlug}/itinerary/${duration}`,
        'it': `https://citybasic.com/it/city/${citySlug}/itinerary/${duration}`,
        'de': `https://citybasic.com/de/city/${citySlug}/itinerary/${duration}`,
        'ja': `https://citybasic.com/ja/city/${citySlug}/itinerary/${duration}`,
        'zh': `https://citybasic.com/zh/city/${citySlug}/itinerary/${duration}`,
        'hi': `https://citybasic.com/hi/city/${citySlug}/itinerary/${duration}`,
        'ar': `https://citybasic.com/ar/city/${citySlug}/itinerary/${duration}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: description.slice(0, 160),
      type: 'website',
      url: `https://citybasic.com/${lang}/city/${citySlug}/itinerary/${duration}`,
    },
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default async function ItineraryPage({ params }: PageProps) {
  const { citySlug, lang, duration } = await params

  // Validate duration
  if (!isValidDuration(duration)) {
    notFound()
  }

  // Load city data
  const city = await getCityData(citySlug, lang)
  if (!city) {
    notFound()
  }

  // Get itinerary items based on duration
  const { mustSee, mustEat } = getItineraryItems(city, duration)

  // If no items available, show 404
  if (mustSee.length === 0 && mustEat.length === 0) {
    notFound()
  }

  // Get dictionaries
  const dict = getDict(lang)
  const dictLang = (lang in ITINERARY_DICT ? lang : 'en') as SupportedLang
  const localDict = ITINERARY_DICT[dictLang]

  // Build page title
  const isAsianLang = ['ja', 'zh', 'hi', 'ar'].includes(lang)
  const durationTitles: Record<ValidDuration, string> = {
    '1-day': localDict.title_1day,
    '2-days': localDict.title_2days,
    '3-days': localDict.title_3days,
  }
  const titlePrefix = durationTitles[duration]
  const pageHeading = isAsianLang
    ? `${titlePrefix}${city.name}`
    : `${titlePrefix} ${city.name}`

  const isRTL = lang === 'ar'
  const totalStops = mustSee.length + mustEat.length

  // Other duration options for navigation
  const otherDurations = VALID_DURATIONS.filter((d) => d !== duration)
  const durationLabels: Record<ValidDuration, string> = {
    '1-day': localDict.day_1,
    '2-days': localDict.day_2,
    '3-days': localDict.day_3,
  }

  return (
    <main
      className="min-h-screen bg-slate-50 dark:bg-slate-950"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <Link
            href={`/${lang}/city/${citySlug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mb-6"
          >
            <svg
              className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {localDict.back_to_city}
          </Link>

          {/* Page Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">
            {pageHeading}
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
            {localDict.subtitle}
          </p>

          {/* Item Count */}
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-500">
            {totalStops} {localDict.items_count}
          </p>

          {/* Duration Switcher */}
          <div className="mt-6 flex flex-wrap gap-3">
            {VALID_DURATIONS.map((d) => (
              <Link
                key={d}
                href={`/${lang}/city/${citySlug}/itinerary/${d}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  d === duration
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {durationLabels[d]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Must-See Section */}
      {mustSee.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {localDict.must_see_section}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mustSee.map((place) => (
              <EnhancedPlaceCard
                key={place.slug}
                place={place}
                citySlug={citySlug}
                lang={lang}
                dict={dict}
              />
            ))}
          </div>
        </section>
      )}

      {/* Must-Eat Section */}
      {mustEat.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
            {localDict.must_eat_section}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mustEat.map((place) => (
              <EnhancedPlaceCard
                key={place.slug}
                place={place}
                citySlug={citySlug}
                lang={lang}
                dict={dict}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Itineraries CTA */}
      <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            {localDict.other_durations}
          </h2>
          <div className="flex justify-center gap-4">
            {otherDurations.map((d) => (
              <Link
                key={d}
                href={`/${lang}/city/${citySlug}/itinerary/${d}`}
                className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {durationLabels[d]}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
