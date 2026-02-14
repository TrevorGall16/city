/**
 * City Photo Gallery - Visual Pinterest-Style Image Wall
 * Routes: /[lang]/city/[citySlug]/gallery
 * Purpose: Rank for image search and provide visual exploration
 */

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { City, Place } from '@/types'
import AdsterraSmartFrame from '@/components/ads/AdsterraSmartFrame'
import { getCityData } from '@/lib/getCityData'

// ============================================================================
// LOCAL TRANSLATION DICTIONARY
// ============================================================================
const GALLERY_DICT = {
  en: {
    title: 'Photos of',
    subtitle: 'Visual Gallery',
    meta_title: 'Photos of {city}: Best Sights & Food Gallery',
    meta_desc: 'Explore {city} through photos. A visual tour of the best sights and food spots.',
    back_to_city: 'Back to City Guide',
    sights: 'Sights',
    food: 'Food',
    photos_count: 'photos',
    sponsored: 'Sponsored',
  },
  fr: {
    title: 'Photos de',
    subtitle: 'Galerie Visuelle',
    meta_title: 'Photos de {city} : Galerie des Attractions et Cuisine',
    meta_desc: 'Explorez {city} en photos. Une visite visuelle des meilleurs sites et restaurants.',
    back_to_city: 'Retour au Guide',
    sights: 'Attractions',
    food: 'Cuisine',
    photos_count: 'photos',
    sponsored: 'Sponsorisé',
  },
  es: {
    title: 'Fotos de',
    subtitle: 'Galería Visual',
    meta_title: 'Fotos de {city}: Galería de Atracciones y Comida',
    meta_desc: 'Explora {city} a través de fotos. Un tour visual de los mejores lugares y restaurantes.',
    back_to_city: 'Volver a la Guía',
    sights: 'Atracciones',
    food: 'Comida',
    photos_count: 'fotos',
    sponsored: 'Patrocinado',
  },
  it: {
    title: 'Foto di',
    subtitle: 'Galleria Visiva',
    meta_title: 'Foto di {city}: Galleria di Attrazioni e Cibo',
    meta_desc: 'Esplora {city} attraverso le foto. Un tour visivo dei migliori luoghi e ristoranti.',
    back_to_city: 'Torna alla Guida',
    sights: 'Attrazioni',
    food: 'Cibo',
    photos_count: 'foto',
    sponsored: 'Sponsorizzato',
  },
  de: {
    title: 'Fotos von',
    subtitle: 'Bildergalerie',
    meta_title: 'Fotos von {city}: Galerie der Sehenswürdigkeiten und Gerichte',
    meta_desc: 'Entdecke {city} in Bildern. Eine visuelle Tour der besten Orte und Restaurants.',
    back_to_city: 'Zurück zum Reiseführer',
    sights: 'Sehenswürdigkeiten',
    food: 'Essen',
    photos_count: 'Fotos',
    sponsored: 'Gesponsert',
  },
  ja: {
    title: 'の写真',
    subtitle: 'フォトギャラリー',
    meta_title: '{city}の写真：観光スポット＆グルメギャラリー',
    meta_desc: '写真で{city}を探索。人気スポットとグルメのビジュアルツアー。',
    back_to_city: 'シティガイドに戻る',
    sights: '観光',
    food: 'グルメ',
    photos_count: '枚',
    sponsored: '広告',
  },
  zh: {
    title: '的照片',
    subtitle: '图片库',
    meta_title: '{city}照片：景点与美食图库',
    meta_desc: '通过照片探索{city}。热门景点和美食的视觉之旅。',
    back_to_city: '返回城市指南',
    sights: '景点',
    food: '美食',
    photos_count: '张照片',
    sponsored: '赞助',
  },
  hi: {
    title: 'की तस्वीरें',
    subtitle: 'फोटो गैलरी',
    meta_title: '{city} की तस्वीरें: दर्शनीय स्थल और भोजन गैलरी',
    meta_desc: 'तस्वीरों के माध्यम से {city} का अन्वेषण करें। सर्वश्रेष्ठ स्थलों और भोजन का दृश्य दौरा।',
    back_to_city: 'सिटी गाइड पर वापस जाएं',
    sights: 'दर्शनीय स्थल',
    food: 'भोजन',
    photos_count: 'तस्वीरें',
    sponsored: 'प्रायोजित',
  },
  ar: {
    title: 'صور',
    subtitle: 'معرض الصور',
    meta_title: 'صور {city}: معرض المعالم والأطعمة',
    meta_desc: 'استكشف {city} من خلال الصور. جولة بصرية لأفضل المعالم والمطاعم.',
    back_to_city: 'العودة إلى دليل المدينة',
    sights: 'معالم',
    food: 'طعام',
    photos_count: 'صورة',
    sponsored: 'إعلان',
  },
} as const

type SupportedLang = keyof typeof GALLERY_DICT

interface GalleryImage {
  src: string
  alt: string
  category: 'Food' | 'Sights'
  name: string
  slug: string
}

// ============================================================================
// DATA FETCHING
// ============================================================================
interface PageProps {
  params: Promise<{ lang: string; citySlug: string }>
}

function extractGalleryImages(city: City): GalleryImage[] {
  const images: GalleryImage[] = []

  // Extract from must_see (flatten groups)
  const mustSeeGroups = city.must_see || []
  mustSeeGroups.forEach((group: { items?: Place[] }) => {
    (group.items || []).forEach((place) => {
      if (place.image) {
        images.push({
          src: place.image,
          alt: place.name_en || place.name_local || 'Attraction',
          category: 'Sights',
          name: place.name_en || place.name_local || '',
          slug: place.slug,
        })
      }
    })
  })

  // Extract from must_eat
  const mustEat = city.must_eat || []
  mustEat.forEach((place) => {
    if (place.image) {
      images.push({
        src: place.image,
        alt: place.name_en || place.name_local || 'Restaurant',
        category: 'Food',
        name: place.name_en || place.name_local || '',
        slug: place.slug,
      })
    }
  })

  return images
}

// ============================================================================
// METADATA GENERATION
// ============================================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, lang } = await params
  const city = await getCityData(citySlug, lang)

  if (!city) {
    return { title: 'Gallery Not Found' }
  }

  const dictLang = (lang in GALLERY_DICT ? lang : 'en') as SupportedLang
  const localDict = GALLERY_DICT[dictLang]

  const pageTitle = localDict.meta_title.replace('{city}', city.name) + ' | 2026'
  const description = localDict.meta_desc.replace(/{city}/g, city.name)

  return {
    title: pageTitle,
    description: description.slice(0, 160),
    alternates: {
      canonical: `https://citybasic.com/${lang}/city/${citySlug}/gallery`,
      languages: {
        'en': `https://citybasic.com/en/city/${citySlug}/gallery`,
        'fr': `https://citybasic.com/fr/city/${citySlug}/gallery`,
        'es': `https://citybasic.com/es/city/${citySlug}/gallery`,
        'it': `https://citybasic.com/it/city/${citySlug}/gallery`,
        'de': `https://citybasic.com/de/city/${citySlug}/gallery`,
        'ja': `https://citybasic.com/ja/city/${citySlug}/gallery`,
        'zh': `https://citybasic.com/zh/city/${citySlug}/gallery`,
        'hi': `https://citybasic.com/hi/city/${citySlug}/gallery`,
        'ar': `https://citybasic.com/ar/city/${citySlug}/gallery`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: description.slice(0, 160),
      type: 'website',
      url: `https://citybasic.com/${lang}/city/${citySlug}/gallery`,
      images: city.hero_image ? [city.hero_image] : [],
    },
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default async function GalleryPage({ params }: PageProps) {
  const { citySlug, lang } = await params

  const city = await getCityData(citySlug, lang)
  if (!city) {
    notFound()
  }

  const dictLang = (lang in GALLERY_DICT ? lang : 'en') as SupportedLang
  const localDict = GALLERY_DICT[dictLang]

  const images = extractGalleryImages(city)

  if (images.length === 0) {
    notFound()
  }

  const isRTL = lang === 'ar'
  const isAsianLang = ['ja', 'zh'].includes(lang)

  // Build page heading based on language
  const pageHeading = isAsianLang
    ? `${city.name}${localDict.title}`
    : `${localDict.title} ${city.name}`

  // Build grid items with ad placeholders after every 8th image
  const gridItems: Array<{ type: 'image'; data: GalleryImage } | { type: 'ad'; id: number }> = []
  let adCount = 0
  images.forEach((img, index) => {
    gridItems.push({ type: 'image', data: img })
    if ((index + 1) % 8 === 0 && index < images.length - 1) {
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

          {/* Subtitle */}
          <p className="mt-2 text-xl text-slate-600 dark:text-slate-400">
            {localDict.subtitle}
          </p>

          {/* Photo Count */}
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-500">
            {images.length} {localDict.photos_count}
          </p>
        </div>
      </div>

      {/* Masonry Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {gridItems.map((item, index) =>
            item.type === 'image' ? (
              <Link
                key={`${item.data.slug}-${index}`}
                href={`/${lang}/city/${citySlug}/${item.data.slug}`}
                className="block break-inside-avoid group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
                  <Image
                    src={item.data.src}
                    alt={item.data.alt}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        item.data.category === 'Food'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {item.data.category === 'Food' ? localDict.food : localDict.sights}
                    </span>
                  </div>
                  {/* Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg">
                      {item.data.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ) : (
              <div
                key={`ad-${item.id}`}
                className="break-inside-avoid flex flex-col justify-center items-center bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 min-h-[280px]"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                  {localDict.sponsored}
                </span>
                <AdsterraSmartFrame
                  height={250}
                  width={300}
                  pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
                />
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}
