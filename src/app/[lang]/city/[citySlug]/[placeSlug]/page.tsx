/**
 * 🛰️ MASTER AI: PLACE PAGE (V4.0 - MULTILINGUAL SEO)
 * ✅ Added: SEO Translation Dictionary for 9 languages (including Chinese)
 * ✅ Enhanced: Fully localized meta titles and Open Graph tags
 * ✅ Preserved: All crash protection and data fallback logic
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getDict } from '@/data/dictionaries'
import { getCityData } from '@/lib/getCityData'
import { getCityFont } from '@/lib/fonts/cityFonts'
import { Clock, DollarSign, Zap, Star, MapPin, ArrowLeft } from 'lucide-react'
import { CommentThread } from '@/components/features/CommentThread'
import type { Metadata } from 'next'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard'
import AdsterraSmartFrame from '@/components/ads/AdsterraSmartFrame'
import FAQSchema from '@/components/seo/FAQSchema'
import { ImageLightbox } from '@/components/ui/ImageLightbox'
import { PLACE_FAQS } from '@/data/place_faqs'

const SEO_DICTIONARY = {
  en: { travelGuide: 'Travel Guide', similar: 'You Might Also Like' },
  fr: { travelGuide: 'Guide de Voyage', similar: 'Vous Aimerez Aussi' },
  ja: { travelGuide: '旅行ガイド', similar: 'こちらもおすすめ' },
  ar: { travelGuide: 'دليل السفر', similar: 'قد يعجبك ايضا' },
  hi: { travelGuide: 'यात्रा गाइड', similar: 'आपको यह भी पसंद आ सकता है' },
  es: { travelGuide: 'Guía de Viaje', similar: 'También te puede gustar' },
  de: { travelGuide: 'Reiseführer', similar: 'Das könnte dir auch gefallen' },
  it: { travelGuide: 'Guida di Viaggio', similar: 'Potrebbe Piacerti Anche' },
  zh: { travelGuide: '旅行指南', similar: '你可能也喜欢' },
} as const

type SupportedLang = keyof typeof SEO_DICTIONARY

interface PageProps {
  params: Promise<{ lang: string; citySlug: string; placeSlug: string }>
}

async function getPlaceData(citySlug: string, placeSlug: string, lang: string) {
  const city = await getCityData(citySlug, lang)
  if (!city) return null

  const allPlaces = [...(city.must_see?.flatMap((g: any) => g.items) || []), ...(city.must_eat || [])]
  const place = allPlaces.find((p: any) => p.slug === placeSlug)
  if (!place) return null

  const similarPlaces = allPlaces
    .filter((p: any) => p.slug !== placeSlug && p.category === place.category)
    .slice(0, 3)

  return { place, cityName: city.name, similarPlaces }
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug, lang)

  if (!data) return { title: 'Place Not Found' }

  const { place, cityName } = data

  // 🌍 Get localized SEO strings (with fallback to English)
  const seoLang = (lang in SEO_DICTIONARY ? lang : 'en') as SupportedLang
  const seoStrings = SEO_DICTIONARY[seoLang]

  // 🎯 SEO: Optimized title with local name first
  const hasLocalName = place.name_local && place.name_local !== place.name_en
  const title = hasLocalName
    ? `${place.name_local} (${place.name_en}) - ${cityName} ${seoStrings.travelGuide}`
    : `${place.name_en} - ${cityName} ${seoStrings.travelGuide}`

  // Extract description safely
  const desc = place.description
  const shortDesc = typeof desc === 'object'
    ? (desc.short || desc.intro || '')
    : (desc || '')

  const description = shortDesc.slice(0, 160)

  return {
    title,
    description,
    alternates: {
      canonical: `https://citybasic.com/${lang}/city/${citySlug}/${placeSlug}`,
      languages: {
        'en': `https://citybasic.com/en/city/${citySlug}/${placeSlug}`,
        'fr': `https://citybasic.com/fr/city/${citySlug}/${placeSlug}`,
        'es': `https://citybasic.com/es/city/${citySlug}/${placeSlug}`,
        'it': `https://citybasic.com/it/city/${citySlug}/${placeSlug}`,
        'ja': `https://citybasic.com/ja/city/${citySlug}/${placeSlug}`,
        'hi': `https://citybasic.com/hi/city/${citySlug}/${placeSlug}`,
        'de': `https://citybasic.com/de/city/${citySlug}/${placeSlug}`,
        'zh': `https://citybasic.com/zh/city/${citySlug}/${placeSlug}`,
        'ar': `https://citybasic.com/ar/city/${citySlug}/${placeSlug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [place.image || '/images/placeholder.jpg'],
      url: `https://citybasic.com/${lang}/city/${citySlug}/${placeSlug}`,
      locale: lang === 'en' ? 'en_US'
        : lang === 'fr' ? 'fr_FR'
        : lang === 'es' ? 'es_ES'
        : lang === 'de' ? 'de_DE'
        : lang === 'it' ? 'it_IT'
        : lang === 'ja' ? 'ja_JP'
        : lang === 'hi' ? 'hi_IN'
        : lang === 'ar' ? 'ar_AR'
        : lang === 'zh' ? 'zh_CN'
        : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [place.image || '/images/placeholder.jpg'],
    },
  }
}

export default async function PlacePage({ params }: PageProps) {
  const { lang, citySlug, placeSlug } = await params;
  const data = await getPlaceData(citySlug, placeSlug, lang);
  const dict = await getDict(lang);
  
  if (!data) notFound();

  const { place } = data;
  const cityFontClass = getCityFont(citySlug);
  const desc = place.description;

  // 🛡️ MASTER AI CRASH PROTECTION
  const shortDesc = typeof desc === 'object' 
    ? (desc.short || desc.intro || '') 
    : (desc || '');

  const historyText = typeof desc === 'object' ? desc.history : null;
  const insiderTip = typeof desc === 'object' ? desc.insider_tip : null;

  // 🛡️ DATA FALLBACKS
  const price = place.price_level || (typeof desc === 'object' ? desc.price_level : null);
  const vibe = place.vibe || (typeof desc === 'object' ? desc.vibe : null);
  const duration = place.duration || (typeof desc === 'object' ? desc.duration : null);
  const goodFor = place.good_for?.[0] || (typeof desc === 'object' ? desc.good_for?.[0] : null);

  // 🎯 SEO: JSON-LD Structured Data
  const isRestaurant = place.category === 'food' || place.category === 'restaurant';
  const currentFAQs = PLACE_FAQS[place.slug] || []

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': isRestaurant ? 'Restaurant' : 'TouristAttraction',
    name: place.name_en,
    alternateName: place.name_local !== place.name_en ? place.name_local : undefined,
    description: shortDesc,
    image: place.image,
    url: `https://citybasic.com/${lang}/city/${citySlug}/${placeSlug}`,
    inLanguage: lang,
    ...(isRestaurant
      ? { servesCuisine: data.cityName, priceRange: price || undefined }
      : { touristType: goodFor || undefined }),
    ...(place.geo?.lat && place.geo?.lng
      ? {
          geo: { '@type': 'GeoCoordinates', latitude: place.geo.lat, longitude: place.geo.lng },
          hasMap: `https://www.google.com/maps?q=$${place.geo.lat},${place.geo.lng}`,
        }
      : {}),
    containedInPlace: { '@type': 'City', name: data.cityName },
  }

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 ${cityFontClass}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <FAQSchema faqs={currentFAQs} />
      <nav className="sticky top-20 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/city/${citySlug}`} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {dict.view_guide || 'Back'}
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{data.cityName}</span>
          </div>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-6 mt-8">
        <ImageLightbox src={place.image || '/images/placeholder.jpg'} alt={place.name_en || 'Place Image'}>
          <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-12 group border-4 border-white dark:border-slate-800">
            <Image src={place.image || '/images/placeholder.jpg'} alt={place.name_en || 'Place Image'} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </ImageLightbox>

        <header className="mb-12">
          <div className="flex flex-col gap-2">
            {typeof place.name_local === 'string' && place.name_local !== place.name_en && (
              <span className="text-2xl font-black uppercase tracking-[0.3em] text-indigo-500 mb-2">{place.name_local}</span>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-6">{place.name_en}</h1>
          </div>
          <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-light max-w-4xl leading-relaxed italic">"{shortDesc}"</p>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', label: dict.logistics || 'Cost', val: price },
            { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500/10 dark:bg-amber-500/20', label: 'Vibe', val: vibe },
            { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10 dark:bg-blue-500/20', label: 'Duration', val: duration },
            { icon: Star, color: 'text-purple-600', bg: 'bg-purple-500/10 dark:bg-purple-500/20', label: 'Best For', val: goodFor }
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-6 rounded-[2rem] border border-white/50 dark:border-white/10 flex flex-col items-center text-center shadow-sm backdrop-blur-sm`}>
              <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.val || 'Standard'}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {historyText && (
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-16">
              <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-1 bg-indigo-500 rounded-full" /> {dict.the_backstory || "The Backstory"}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">{historyText}</p>
            </div>
          )}

          {insiderTip && (
            <div className="bg-indigo-600 p-10 md:p-12 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10"><Star className="w-32 h-32" /></div>
              <h3 className="relative flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-200 mb-6">
                <Star className="w-5 h-5 fill-current" /> {dict.local_secret || "Local Secret"}
              </h3>
              <p className="relative text-2xl md:text-3xl font-bold leading-tight">"{insiderTip}"</p>
            </div>
          )}
          {/* Guaranteed Ad Placement */}
          <div className="my-12 flex justify-center">
            <AdsterraSmartFrame
              height={250}
              width={300}
              pKey="81531fc7e6a8cf5cc6de9e368b8f2c11"
            />
          </div>

{data.similarPlaces && data.similarPlaces.length > 0 && (
            <section className="py-16 border-t border-slate-200 dark:border-slate-800 mb-12">
              <h3 className="text-2xl font-black uppercase mb-8 text-slate-900 dark:text-white tracking-tight">
                {SEO_DICTIONARY[lang as SupportedLang]?.similar || 'You Might Also Like'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {data.similarPlaces.map((item: any) => (
                  <EnhancedPlaceCard 
                    key={item.slug} 
                    place={item} 
                    citySlug={citySlug} 
                    lang={lang} 
                    dict={dict} 
                  />
                ))}
              </div>
            </section>
          )}
          <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black uppercase mb-8 text-slate-900 dark:text-white">{dict.discussion_tips || "Discussion & Tips"}</h3>
            <CommentThread citySlug={citySlug} placeSlug={placeSlug} dict={dict} />
          </div>
        </div>
      </article>
    </main>
  );
}