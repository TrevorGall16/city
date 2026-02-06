/**
 * Collection Page - SEO Hub for Category-Based Item Aggregation
 * Routes: /[lang]/city/[citySlug]/lists/food | /[lang]/city/[citySlug]/lists/sights
 * Purpose: Rank for keywords like "Best Food in Paris" or "Top Sights in Tokyo"
 */

import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { City, Place } from '@/types'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import { getDict } from '@/data/dictionaries'
import AdsterraBanner from '@/components/ads/AdsterraBanner'
import AdsterraSmartFrame from '@/components/ads/AdsterraSmartFrame'

// ============================================================================
// NATIVE AD PLACEHOLDER COMPONENT
// ============================================================================
function NativeAdPlaceholder({ label }: { label: string }) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-700 h-full flex flex-col">
      {/* Image placeholder matching EnhancedPlaceCard aspect ratio */}
      <div className="aspect-[16/10] relative bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {label}
          </span>
        </div>
      </div>
      {/* Content placeholder */}
      <div className="p-6 flex-grow">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      </div>
    </div>
  )
}

// ============================================================================
// LOCAL TRANSLATION DICTIONARY (Safety: Isolated from global dictionaries.ts)
// ============================================================================
const COLLECTION_DICT = {
  en: {
    food_title: 'Best Food in',
    sights_title: 'Top Sights in',
    coffee_title: 'Best Coffee & Cafes in',
    bakeries_title: 'Best Bakeries & Sweets in',
    stay_title: 'Where to Stay in',
    cheap_eats_title: 'Best Cheap Eats in',
    food_description: 'Discover the must-eat dishes and local favorites in',
    sights_description: 'Explore the top attractions and must-see places in',
    coffee_description: 'Find the best coffee shops and cozy cafes in',
    bakeries_description: 'Discover the best bakeries, pastries and sweet treats in',
    stay_description: 'Find the best hotels, hostels and accommodations in',
    cheap_eats_description: 'Discover budget-friendly dining and street food in',
    back_to_city: 'Back to City Guide',
    items_found: 'items',
    no_items: 'No items found',
    sponsored: 'Sponsored',
    explore_other_cities: 'Explore Other Cities',
    view_guide: 'View Guide',
  },
  fr: {
    food_title: 'Meilleure Cuisine de',
    sights_title: 'Meilleures Attractions de',
    coffee_title: 'Meilleurs Cafés de',
    bakeries_title: 'Meilleures Boulangeries de',
    stay_title: 'Où Dormir à',
    cheap_eats_title: 'Manger Pas Cher à',
    food_description: 'Découvrez les plats incontournables et les favoris locaux de',
    sights_description: 'Explorez les meilleures attractions et lieux incontournables de',
    coffee_description: 'Trouvez les meilleurs cafés et salons de thé de',
    bakeries_description: 'Découvrez les meilleures boulangeries et pâtisseries de',
    stay_description: 'Trouvez les meilleurs hôtels et hébergements à',
    cheap_eats_description: 'Découvrez où manger pas cher et la street food de',
    back_to_city: 'Retour au Guide',
    items_found: 'articles',
    no_items: 'Aucun article trouvé',
    sponsored: 'Sponsorisé',
    explore_other_cities: 'Explorer d\'Autres Villes',
    view_guide: 'Voir le Guide',
  },
  es: {
    food_title: 'Mejor Comida en',
    sights_title: 'Mejores Atracciones en',
    coffee_title: 'Mejores Cafeterías en',
    bakeries_title: 'Mejores Panaderías en',
    stay_title: 'Dónde Alojarse en',
    cheap_eats_title: 'Comer Barato en',
    food_description: 'Descubre los platos imprescindibles y favoritos locales de',
    sights_description: 'Explora las mejores atracciones y lugares imprescindibles de',
    coffee_description: 'Encuentra las mejores cafeterías y coffee shops de',
    bakeries_description: 'Descubre las mejores panaderías y dulces de',
    stay_description: 'Encuentra los mejores hoteles y alojamientos en',
    cheap_eats_description: 'Descubre comida económica y street food en',
    back_to_city: 'Volver a la Guía',
    items_found: 'artículos',
    no_items: 'No se encontraron artículos',
    sponsored: 'Patrocinado',
    explore_other_cities: 'Explorar Otras Ciudades',
    view_guide: 'Ver Guía',
  },
  it: {
    food_title: 'Miglior Cibo a',
    sights_title: 'Migliori Attrazioni a',
    coffee_title: 'Migliori Caffetterie a',
    bakeries_title: 'Migliori Pasticcerie a',
    stay_title: 'Dove Dormire a',
    cheap_eats_title: 'Mangiare Economico a',
    food_description: 'Scopri i piatti imperdibili e i preferiti locali di',
    sights_description: 'Esplora le migliori attrazioni e i luoghi imperdibili di',
    coffee_description: 'Trova le migliori caffetterie e bar di',
    bakeries_description: 'Scopri le migliori pasticcerie e dolci di',
    stay_description: 'Trova i migliori hotel e alloggi a',
    cheap_eats_description: 'Scopri dove mangiare spendendo poco a',
    back_to_city: 'Torna alla Guida',
    items_found: 'articoli',
    no_items: 'Nessun articolo trovato',
    sponsored: 'Sponsorizzato',
    explore_other_cities: 'Esplora Altre Città',
    view_guide: 'Vedi Guida',
  },
  de: {
    food_title: 'Bestes Essen in',
    sights_title: 'Top Sehenswürdigkeiten in',
    coffee_title: 'Beste Cafés in',
    bakeries_title: 'Beste Bäckereien in',
    stay_title: 'Übernachten in',
    cheap_eats_title: 'Günstig Essen in',
    food_description: 'Entdecke die Must-Eat-Gerichte und lokalen Favoriten in',
    sights_description: 'Erkunde die Top-Attraktionen und Sehenswürdigkeiten in',
    coffee_description: 'Finde die besten Cafés und Kaffeehäuser in',
    bakeries_description: 'Entdecke die besten Bäckereien und Süßwaren in',
    stay_description: 'Finde die besten Hotels und Unterkünfte in',
    cheap_eats_description: 'Entdecke günstiges Essen und Street Food in',
    back_to_city: 'Zurück zum Reiseführer',
    items_found: 'Einträge',
    no_items: 'Keine Einträge gefunden',
    sponsored: 'Gesponsert',
    explore_other_cities: 'Andere Städte Entdecken',
    view_guide: 'Guide Ansehen',
  },
  ja: {
    food_title: 'おすすめグルメ',
    sights_title: 'おすすめ観光スポット',
    coffee_title: 'おすすめカフェ',
    bakeries_title: 'おすすめベーカリー',
    stay_title: '宿泊ガイド',
    cheap_eats_title: '安くて美味しいグルメ',
    food_description: '必食グルメとローカルフードを発見',
    sights_description: '人気の観光スポットと必見の名所を探索',
    coffee_description: '人気のカフェとコーヒーショップを発見',
    bakeries_description: '人気のベーカリーとスイーツを発見',
    stay_description: 'おすすめのホテルと宿泊施設を発見',
    cheap_eats_description: 'お手頃価格のグルメとストリートフードを発見',
    back_to_city: 'シティガイドに戻る',
    items_found: '件',
    no_items: 'アイテムが見つかりません',
    sponsored: '広告',
    explore_other_cities: '他の都市を探索',
    view_guide: 'ガイドを見る',
  },
  zh: {
    food_title: '最佳美食',
    sights_title: '热门景点',
    coffee_title: '最佳咖啡馆',
    bakeries_title: '最佳面包店',
    stay_title: '住宿推荐',
    cheap_eats_title: '平价美食',
    food_description: '探索必尝美食和当地特色',
    sights_description: '探索热门景点和必看名胜',
    coffee_description: '发现最佳咖啡馆和咖啡店',
    bakeries_description: '发现最佳面包店和甜点',
    stay_description: '发现最佳酒店和住宿',
    cheap_eats_description: '发现平价美食和街头小吃',
    back_to_city: '返回城市指南',
    items_found: '个项目',
    no_items: '未找到项目',
    sponsored: '赞助',
    explore_other_cities: '探索其他城市',
    view_guide: '查看指南',
  },
  hi: {
    food_title: 'सर्वश्रेष्ठ भोजन',
    sights_title: 'शीर्ष आकर्षण',
    coffee_title: 'सर्वश्रेष्ठ कैफे',
    bakeries_title: 'सर्वश्रेष्ठ बेकरी',
    stay_title: 'कहाँ ठहरें',
    cheap_eats_title: 'सस्ता भोजन',
    food_description: 'अवश्य खाने वाले व्यंजन और स्थानीय पसंदीदा खोजें',
    sights_description: 'शीर्ष आकर्षण और अवश्य देखने योग्य स्थान खोजें',
    coffee_description: 'सर्वश्रेष्ठ कॉफी शॉप और कैफे खोजें',
    bakeries_description: 'सर्वश्रेष्ठ बेकरी और मिठाइयाँ खोजें',
    stay_description: 'सर्वश्रेष्ठ होटल और आवास खोजें',
    cheap_eats_description: 'बजट में खाना और स्ट्रीट फूड खोजें',
    back_to_city: 'सिटी गाइड पर वापस जाएं',
    items_found: 'आइटम',
    no_items: 'कोई आइटम नहीं मिला',
    sponsored: 'प्रायोजित',
    explore_other_cities: 'अन्य शहरों का अन्वेषण करें',
    view_guide: 'गाइड देखें',
  },
  ar: {
    food_title: 'أفضل الأطعمة في',
    sights_title: 'أهم المعالم في',
    coffee_title: 'أفضل المقاهي في',
    bakeries_title: 'أفضل المخابز في',
    stay_title: 'أين تقيم في',
    cheap_eats_title: 'أكل رخيص في',
    food_description: 'اكتشف الأطباق التي يجب تجربتها والمفضلات المحلية في',
    sights_description: 'استكشف أفضل المعالم السياحية والأماكن التي يجب زيارتها في',
    coffee_description: 'اعثر على أفضل المقاهي ومحلات القهوة في',
    bakeries_description: 'اكتشف أفضل المخابز والحلويات في',
    stay_description: 'اعثر على أفضل الفنادق وأماكن الإقامة في',
    cheap_eats_description: 'اكتشف الأكل الرخيص وطعام الشارع في',
    back_to_city: 'العودة إلى دليل المدينة',
    items_found: 'عنصر',
    no_items: 'لم يتم العثور على عناصر',
    sponsored: 'إعلان',
    explore_other_cities: 'استكشاف مدن أخرى',
    view_guide: 'عرض الدليل',
  },
} as const

type SupportedLang = keyof typeof COLLECTION_DICT
type ValidCategory = 'food' | 'sights' | 'coffee' | 'bakeries' | 'stay' | 'cheap-eats'

const VALID_CATEGORIES: ValidCategory[] = ['food', 'sights', 'coffee', 'bakeries', 'stay', 'cheap-eats']

// ============================================================================
// DATA FETCHING
// ============================================================================
interface PageProps {
  params: Promise<{ lang: string; citySlug: string; category: string }>
}

async function getCityData(slug: string, lang: string): Promise<City | null> {
  try {
    const fileName = lang === 'en' ? `${slug}.json` : `${slug}-${lang}.json`
    const filePath = path.join(process.cwd(), 'src/data/cities', fileName)
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent) as City
  } catch {
    try {
      // Fallback to English if localized file missing
      const fallbackPath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
      const fallbackContent = await fs.readFile(fallbackPath, 'utf8')
      return JSON.parse(fallbackContent) as City
    } catch {
      return null
    }
  }
}

function getCollectionItems(city: City, category: ValidCategory): Place[] {
  switch (category) {
    case 'food':
      return city.must_eat || []
    case 'sights':
      // Flatten all items from must_see groups
      const groups = city.must_see || []
      return groups.flatMap((group: any) => group.items || [])
    case 'coffee':
      return city.best_coffee || []
    case 'bakeries':
      return city.best_bakeries || []
    case 'stay':
      return city.where_to_stay || []
    case 'cheap-eats':
      return city.cheap_eats || []
    default:
      return []
  }
}

function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory)
}

async function getOtherCities(currentSlug: string, limit: number = 6): Promise<Array<{ slug: string; name: string; hero_image: string }>> {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  try {
    const files = await fs.readdir(citiesDir)
    const cityFiles = files.filter(f => f.endsWith('.json') && !/-\w{2}\.json$/.test(f))

    const cities: Array<{ slug: string; name: string; hero_image: string }> = []

    for (const file of cityFiles) {
      const slug = file.replace('.json', '')
      if (slug === currentSlug) continue

      try {
        const content = await fs.readFile(path.join(citiesDir, file), 'utf8')
        const data = JSON.parse(content)
        cities.push({
          slug: data.slug || slug,
          name: data.name || slug,
          hero_image: data.hero_image || '',
        })
      } catch { /* skip invalid files */ }
    }

    // Shuffle and return limited results
    return cities.sort(() => Math.random() - 0.5).slice(0, limit)
  } catch {
    return []
  }
}

// ============================================================================
// METADATA GENERATION
// ============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, lang, category } = await params

  if (!isValidCategory(category)) {
    return { title: 'Not Found' }
  }

  const city = await getCityData(citySlug, lang)
  if (!city) {
    return { title: 'City Not Found' }
  }

  const items = getCollectionItems(city, category)
  if (items.length === 0) {
    return { title: 'Not Found' }
  }

  // Get localized strings (with English fallback)
  const dictLang = (lang in COLLECTION_DICT ? lang : 'en') as SupportedLang
  const localDict = COLLECTION_DICT[dictLang]

  // Build SEO-optimized title and description
  const isAsianLang = ['ja', 'zh', 'hi', 'ar'].includes(lang)
  const categoryTitles: Record<ValidCategory, string> = {
    food: localDict.food_title,
    sights: localDict.sights_title,
    coffee: localDict.coffee_title,
    bakeries: localDict.bakeries_title,
    stay: localDict.stay_title,
    'cheap-eats': localDict.cheap_eats_title,
  }
  const categoryDescs: Record<ValidCategory, string> = {
    food: localDict.food_description,
    sights: localDict.sights_description,
    coffee: localDict.coffee_description,
    bakeries: localDict.bakeries_description,
    stay: localDict.stay_description,
    'cheap-eats': localDict.cheap_eats_description,
  }
  const titlePrefix = categoryTitles[category]
  const descPrefix = categoryDescs[category]

  // Asian languages: City name comes after the title prefix
  const pageTitle = isAsianLang
    ? `${city.name} ${titlePrefix} | 2026`
    : `${titlePrefix} ${city.name} | 2026`

  const description = isAsianLang
    ? `${city.name} ${descPrefix}`
    : `${descPrefix} ${city.name}. ${items.length} ${localDict.items_found}.`

  // Extract top items for enhanced description
  const topItems = items.slice(0, 3).map((item: Place) => item.name_en).filter(Boolean)
  const enhancedDesc = topItems.length > 0
    ? `${description.slice(0, 120)} ${topItems.join(', ')}.`
    : description

  return {
    title: pageTitle,
    description: enhancedDesc.slice(0, 160),
    alternates: {
      canonical: `https://citybasic.com/${lang}/city/${citySlug}/lists/${category}`,
      languages: {
        'en': `https://citybasic.com/en/city/${citySlug}/lists/${category}`,
        'fr': `https://citybasic.com/fr/city/${citySlug}/lists/${category}`,
        'es': `https://citybasic.com/es/city/${citySlug}/lists/${category}`,
        'it': `https://citybasic.com/it/city/${citySlug}/lists/${category}`,
        'de': `https://citybasic.com/de/city/${citySlug}/lists/${category}`,
        'ja': `https://citybasic.com/ja/city/${citySlug}/lists/${category}`,
        'zh': `https://citybasic.com/zh/city/${citySlug}/lists/${category}`,
        'hi': `https://citybasic.com/hi/city/${citySlug}/lists/${category}`,
        'ar': `https://citybasic.com/ar/city/${citySlug}/lists/${category}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: enhancedDesc.slice(0, 160),
      type: 'website',
      url: `https://citybasic.com/${lang}/city/${citySlug}/lists/${category}`,
    },
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default async function CollectionPage({ params }: PageProps) {
  const { citySlug, lang, category } = await params

  // Validate category
  if (!isValidCategory(category)) {
    notFound()
  }

  // Load city data
  const city = await getCityData(citySlug, lang)
  if (!city) {
    notFound()
  }

  // Extract items based on category
  const items = getCollectionItems(city, category)
  if (items.length === 0) {
    notFound()
  }

  // Get dictionaries
  const dict = getDict(lang)
  const dictLang = (lang in COLLECTION_DICT ? lang : 'en') as SupportedLang
  const localDict = COLLECTION_DICT[dictLang]

  // Get other cities for cross-linking
  const otherCities = await getOtherCities(citySlug, 6)

  // Build page title
  const isAsianLang = ['ja', 'zh', 'hi', 'ar'].includes(lang)
  const categoryTitles: Record<ValidCategory, string> = {
    food: localDict.food_title,
    sights: localDict.sights_title,
    coffee: localDict.coffee_title,
    bakeries: localDict.bakeries_title,
    stay: localDict.stay_title,
    'cheap-eats': localDict.cheap_eats_title,
  }
  const titlePrefix = categoryTitles[category]
  const pageHeading = isAsianLang
    ? `${city.name} ${titlePrefix}`
    : `${titlePrefix} ${city.name}`

  const isRTL = lang === 'ar'

  // Determine if list is long enough for in-feed ads
  const SHOW_IN_FEED_AD = items.length > 4

  // Build grid items with ad placeholders after every 6th item (only for long lists)
  const gridItems: Array<{ type: 'place'; data: Place } | { type: 'ad'; id: number }> = []
  let adCount = 0
  items.forEach((item, index) => {
    gridItems.push({ type: 'place', data: item })
    // Insert ad after every 6th item (positions 6, 12, 18, etc.)
    if (SHOW_IN_FEED_AD && (index + 1) % 6 === 0 && index < items.length - 1) {
      adCount++
      gridItems.push({ type: 'ad', id: adCount })
    }
  })

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

          {/* Item Count */}
          <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
            {items.length} {localDict.items_found}
          </p>
        </div>
      </div>

      {/* Items Grid with Native Ads */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {gridItems.map((gridItem, index) =>
            gridItem.type === 'place' ? (
              <EnhancedPlaceCard
                key={gridItem.data.slug}
                place={gridItem.data}
                citySlug={citySlug}
                lang={lang}
                dict={dict}
              />
            ) : (
  /* 👇 THIS IS THE NEW PART (Replaces NativeAdPlaceholder) */
              <div 
                key={`ad-${gridItem.id}`} 
                className="flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800/50 rounded-[2rem] border border-slate-200 dark:border-slate-700 h-full min-h-[300px]"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                  {localDict.sponsored}
                </span>
{/* 👇 USE THE NEW SMART FRAME */}
            <AdsterraSmartFrame
              height={250}
              width={300}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>
              /* 👆 END OF NEW PART */
            )
          )}
        </div>

        {/* Fallback Ad for short lists (no in-feed ads were shown) */}
        {!SHOW_IN_FEED_AD && (
          <div className="mt-10 flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              {localDict.sponsored}
            </span>
            <AdsterraSmartFrame
              height={250}
              width={300}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>
        )}
      </div>

      {/* Explore Other Cities Section */}
      {otherCities.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              {localDict.explore_other_cities}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {otherCities.map((otherCity) => (
                <Link
                  key={otherCity.slug}
                  href={`/${lang}/city/${otherCity.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 dark:bg-slate-800"
                >
                  {otherCity.hero_image && (
                    <Image
                      src={otherCity.hero_image}
                      alt={otherCity.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  {/* City Name */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3 text-center">
                    <span className="text-white font-bold text-sm sm:text-base drop-shadow-lg">
                      {otherCity.name}
                    </span>
                    <span className="text-white/80 text-[10px] uppercase tracking-wider mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {localDict.view_guide}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
