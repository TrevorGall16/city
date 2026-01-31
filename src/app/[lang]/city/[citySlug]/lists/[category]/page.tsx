/**
 * Collection Page - SEO Hub for Category-Based Item Aggregation
 * Routes: /[lang]/city/[citySlug]/lists/food | /[lang]/city/[citySlug]/lists/sights
 * Purpose: Rank for keywords like "Best Food in Paris" or "Top Sights in Tokyo"
 */

import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { City, Place } from '@/types'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import { getDict } from '@/data/dictionaries'

// ============================================================================
// LOCAL TRANSLATION DICTIONARY (Safety: Isolated from global dictionaries.ts)
// ============================================================================
const COLLECTION_DICT = {
  en: {
    food_title: 'Best Food in',
    sights_title: 'Top Sights in',
    food_description: 'Discover the must-eat dishes and local favorites in',
    sights_description: 'Explore the top attractions and must-see places in',
    back_to_city: 'Back to City Guide',
    items_found: 'items',
    no_items: 'No items found',
  },
  fr: {
    food_title: 'Meilleure Cuisine de',
    sights_title: 'Meilleures Attractions de',
    food_description: 'Découvrez les plats incontournables et les favoris locaux de',
    sights_description: 'Explorez les meilleures attractions et lieux incontournables de',
    back_to_city: 'Retour au Guide',
    items_found: 'articles',
    no_items: 'Aucun article trouvé',
  },
  es: {
    food_title: 'Mejor Comida en',
    sights_title: 'Mejores Atracciones en',
    food_description: 'Descubre los platos imprescindibles y favoritos locales de',
    sights_description: 'Explora las mejores atracciones y lugares imprescindibles de',
    back_to_city: 'Volver a la Guía',
    items_found: 'artículos',
    no_items: 'No se encontraron artículos',
  },
  it: {
    food_title: 'Miglior Cibo a',
    sights_title: 'Migliori Attrazioni a',
    food_description: 'Scopri i piatti imperdibili e i preferiti locali di',
    sights_description: 'Esplora le migliori attrazioni e i luoghi imperdibili di',
    back_to_city: 'Torna alla Guida',
    items_found: 'articoli',
    no_items: 'Nessun articolo trovato',
  },
  de: {
    food_title: 'Bestes Essen in',
    sights_title: 'Top Sehenswürdigkeiten in',
    food_description: 'Entdecke die Must-Eat-Gerichte und lokalen Favoriten in',
    sights_description: 'Erkunde die Top-Attraktionen und Sehenswürdigkeiten in',
    back_to_city: 'Zurück zum Reiseführer',
    items_found: 'Einträge',
    no_items: 'Keine Einträge gefunden',
  },
  ja: {
    food_title: 'おすすめグルメ',
    sights_title: 'おすすめ観光スポット',
    food_description: '必食グルメとローカルフードを発見',
    sights_description: '人気の観光スポットと必見の名所を探索',
    back_to_city: 'シティガイドに戻る',
    items_found: '件',
    no_items: 'アイテムが見つかりません',
  },
  zh: {
    food_title: '最佳美食',
    sights_title: '热门景点',
    food_description: '探索必尝美食和当地特色',
    sights_description: '探索热门景点和必看名胜',
    back_to_city: '返回城市指南',
    items_found: '个项目',
    no_items: '未找到项目',
  },
  hi: {
    food_title: 'सर्वश्रेष्ठ भोजन',
    sights_title: 'शीर्ष आकर्षण',
    food_description: 'अवश्य खाने वाले व्यंजन और स्थानीय पसंदीदा खोजें',
    sights_description: 'शीर्ष आकर्षण और अवश्य देखने योग्य स्थान खोजें',
    back_to_city: 'सिटी गाइड पर वापस जाएं',
    items_found: 'आइटम',
    no_items: 'कोई आइटम नहीं मिला',
  },
  ar: {
    food_title: 'أفضل الأطعمة في',
    sights_title: 'أهم المعالم في',
    food_description: 'اكتشف الأطباق التي يجب تجربتها والمفضلات المحلية في',
    sights_description: 'استكشف أفضل المعالم السياحية والأماكن التي يجب زيارتها في',
    back_to_city: 'العودة إلى دليل المدينة',
    items_found: 'عنصر',
    no_items: 'لم يتم العثور على عناصر',
  },
} as const

type SupportedLang = keyof typeof COLLECTION_DICT
type ValidCategory = 'food' | 'sights'

const VALID_CATEGORIES: ValidCategory[] = ['food', 'sights']

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
  if (category === 'food') {
    return city.must_eat || []
  }

  if (category === 'sights') {
    // Flatten all items from must_see groups
    const groups = city.must_see || []
    return groups.flatMap((group: any) => group.items || [])
  }

  return []
}

function isValidCategory(category: string): category is ValidCategory {
  return VALID_CATEGORIES.includes(category as ValidCategory)
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
  const titlePrefix = category === 'food' ? localDict.food_title : localDict.sights_title
  const descPrefix = category === 'food' ? localDict.food_description : localDict.sights_description

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

  // Build page title
  const isAsianLang = ['ja', 'zh', 'hi', 'ar'].includes(lang)
  const titlePrefix = category === 'food' ? localDict.food_title : localDict.sights_title
  const pageHeading = isAsianLang
    ? `${city.name} ${titlePrefix}`
    : `${titlePrefix} ${city.name}`

  const isRTL = lang === 'ar'

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

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item: Place) => (
            <EnhancedPlaceCard
              key={item.slug}
              place={item}
              citySlug={citySlug}
              lang={lang}
              dict={dict}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
