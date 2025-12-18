/**
 * Place Detail Page - COMPLETE SEO & REVENUE OPTIMIZED
 * 
 * ✅ Rich Snippet Schemas (FoodEstablishment, TouristAttraction)
 * ✅ Strong Internal Linking (Back to City, Smart Nearby Algorithm)
 * ✅ Conversion Hooks (Book Table, Get Tickets CTAs)
 * ✅ LCP Performance (Priority images, perfect sizes)
 * ✅ Enhanced Metadata (OpenGraph, Twitter Cards)
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import { MapPin, Clock, Sun, ArrowLeft, ExternalLink, Utensils, Ticket, Star, DollarSign, Users } from 'lucide-react'
import type { City, Place } from '@/types'
import { TranslationHook } from '@/components/features/TranslationHook'
import { AdContainer } from '@/components/ads/AdContainer'
import { CommentThread } from '@/components/features/CommentThread'
import type { Metadata } from 'next'
import { getCityFont } from '@/lib/fonts/cityFonts'


interface PageProps {
  params: Promise<{ citySlug: string; placeSlug: string }>
}

// Helper: Calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

async function getPlaceData(
  citySlug: string,
  placeSlug: string
): Promise<{ city: City; place: Place; nearbyPlaces: Place[]; sameCategoryPlaces: Place[] } | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${citySlug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const city: City = JSON.parse(fileContent)

    const mustSeeItems = city.must_see.flatMap(group => group.items)
    const allPlaces = [...city.must_eat, ...mustSeeItems]
    
    const place = allPlaces.find(p => p.slug === placeSlug)
  
    if (!place) return null

    // ✅ SMART NEARBY ALGORITHM: Prioritize by distance if geo available
    let nearbyPlaces: Place[] = []
    
    if (place.geo) {
      // Get places with geo data, sorted by distance
      nearbyPlaces = allPlaces
        .filter(p => p.slug !== placeSlug && p.geo)
        .map(p => ({
          ...p,
          distance: calculateDistance(
            place.geo!.lat, 
            place.geo!.lng, 
            p.geo!.lat, 
            p.geo!.lng
          )
        }))
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 6)
    } else {
      // Fallback: Random selection
      nearbyPlaces = allPlaces
        .filter(p => p.slug !== placeSlug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
    }

    // ✅ SAME CATEGORY RECOMMENDATIONS (for "More [Food/Sights] in City" section)
    const sameCategoryPlaces = allPlaces
      .filter(p => p.slug !== placeSlug && p.category === place.category)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    return { city, place, nearbyPlaces, sameCategoryPlaces }
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)

  const params = []

  for (const file of files) {
    if (!file.endsWith('.json')) continue

    const citySlug = file.replace('.json', '')
    const filePath = path.join(citiesDir, file)
    const content = await fs.readFile(filePath, 'utf-8')
    const city: City = JSON.parse(content)

    const mustSeeItems = city.must_see.flatMap(group => group.items)
    const allPlaces = [...city.must_eat, ...mustSeeItems]

    for (const place of allPlaces) {
      params.push({
        citySlug,
        placeSlug: place.slug,
      })
    }
  }

  return params
}

// ✅ ENHANCED METADATA with OpenGraph & Twitter
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug)

  if (!data) {
    return { title: 'Place Not Found' }
  }

  const { city, place } = data
  const isComplex = typeof place.description === 'object'
  const desc = isComplex ? (place.description as any) : null
  
  // Generate rich description
  const descriptionText = isComplex && desc.short 
    ? desc.short 
    : (typeof place.description === 'string' ? place.description : `Visit ${place.name_en} in ${city.name}`)
  
  const priceInfo = desc?.price_level ? ` ${desc.price_level} price level.` : ''
  const vibeInfo = desc?.vibe ? ` Vibe: ${desc.vibe}.` : ''
  const durationInfo = desc?.duration ? ` Duration: ${desc.duration}.` : ''
  
  const fullDescription = `${descriptionText}${priceInfo}${vibeInfo}${durationInfo} Local name: ${place.name_local}. Complete guide with insider tips, best times to visit, and practical information.`

  return {
    title: `${place.name_en} in ${city.name} - ${place.category === 'food' ? 'Restaurant Guide' : 'Travel Guide'} | CityBasic`,
    description: fullDescription.slice(0, 160),
    keywords: [
      place.name_en,
      place.name_local,
      city.name,
      place.category === 'food' ? 'restaurant' : 'attraction',
      place.category === 'food' ? 'food guide' : 'tourist guide',
      'travel tips',
      'local recommendations',
      ...(desc?.good_for || [])
    ].join(', '),
    openGraph: {
      title: `${place.name_en} (${place.name_local}) - ${city.name}`,
      description: descriptionText.slice(0, 200),
      images: [place.image],
      type: 'article',
      url: `https://citybasic.com/${citySlug}/${placeSlug}`,
      siteName: 'CityBasic'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${place.name_en} in ${city.name}`,
      description: descriptionText.slice(0, 200),
      images: [place.image],
    },
    alternates: {
      canonical: `https://citybasic.com/${citySlug}/${placeSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      }
    }
  }
}

export default async function PlacePage({ params }: PageProps) {
  const { citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug)

  if (!data) notFound()

  const { city, place, nearbyPlaces, sameCategoryPlaces } = data
  const cityFontClass = getCityFont(citySlug)
  
  const showTranslation = place.name_local && place.name_local !== place.name_en
  const isGenericStaple = place.is_generic_staple
  const showLocationSection = !isGenericStaple && place.geo

  const isComplex = typeof place.description === 'object' && place.description !== null
  const desc = isComplex ? (place.description as any) : null

  const isFood = place.category === 'food'
  const isSight = place.category === 'sight' || place.category === 'attraction'

  // ✅ GENERATE STRUCTURED DATA (FoodEstablishment or TouristAttraction)
  const structuredData = isFood ? {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": place.name_en,
    "alternateName": place.name_local,
    "description": desc?.short || (typeof place.description === 'string' ? place.description : ''),
    "image": place.image,
    "priceRange": desc?.price_level === 'Affordable' ? '$' : desc?.price_level === 'Moderate' ? '$$' : '$$$',
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressCountry": city.country
    },
    ...(place.geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": place.geo.lat,
        "longitude": place.geo.lng
      }
    }),
    "servesCuisine": city.country,
    "acceptsReservations": "True"
  } : {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": place.name_en,
    "alternateName": place.name_local,
    "description": desc?.short || (typeof place.description === 'string' ? place.description : ''),
    "image": place.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city.name,
      "addressCountry": city.country
    },
    ...(place.geo && {
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": place.geo.lat,
        "longitude": place.geo.lng
      }
    }),
    "touristType": desc?.good_for?.join(', ') || "General tourists"
  }

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://citybasic.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": city.name,
        "item": `https://citybasic.com/${citySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": place.name_en,
        "item": `https://citybasic.com/${citySlug}/${placeSlug}`
      }
    ]
  }

  return (
    <div className={cityFontClass}>
  <main className="min-h-screen">
      
      {/* ✅ STRUCTURED DATA - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        
        {/* ✅ ENHANCED BREADCRUMB with Visual Back Button */}
        <div className="flex items-center justify-between mb-6">
          <nav className="text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            {' / '}
            <Link href={`/${citySlug}`} className="hover:text-indigo-600 transition-colors">{city.name}</Link>
            {' / '}
            <span className="text-slate-900 dark:text-slate-200">{place.name_en}</span>
          </nav>
          
          {/* Back to City Guide Button */}
          <Link 
            href={`/${citySlug}#${isFood ? 'must-eat' : 'must-see'}`}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 transition-all text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {city.name} Guide
          </Link>
        </div>

        <div className={`grid grid-cols-1 gap-8 ${showLocationSection ? 'lg:grid-cols-3' : ''}`}>
          
          <div className={showLocationSection ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}>
            
            {/* ✅ HERO IMAGE - LCP OPTIMIZED */}
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800 shadow-lg">
              <Image
                src={place.image}
                alt={`${place.name_en} in ${city.name}`}
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
            </div>

            {/* Title */}
  <h1 className="font-city text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
  {place.name_en}
</h1>

            {/* Translation */}
            {showTranslation && (
              <TranslationHook
                text={place.name_local ?? place.name_en}
                placeName={place.name_en}
                className="mb-6"
              />
            )}

            {/* Tags & Logistics Row */}
            {isComplex && (
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {/* Category Badge */}
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                  {isFood ? '🍽️ Must Eat' : '🏛️ Must See'}
                </span>

                {/* Price Level */}
                {desc.price_level && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                    <DollarSign className="w-3.5 h-3.5" />
                    {desc.price_level}
                  </span>
                )}

                {/* Duration */}
                {desc.duration && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    <Clock className="w-3.5 h-3.5" />
                    {desc.duration}
                  </span>
                )}

                {/* Best Time */}
                {desc.best_time && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-100 dark:border-amber-800">
                    <Sun className="w-3.5 h-3.5" />
                    {desc.best_time}
                  </span>
                )}

                {/* Vibe Tag */}
                {desc.vibe && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                    ✨ {desc.vibe}
                  </span>
                )}
                
                {/* Good For Tags */}
                {desc.good_for && desc.good_for.map((tag: string) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <Users className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* ✅ CONVERSION HOOKS - HIGH-CONVERTING CTAs */}
            {!isGenericStaple && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {isFood && (
                  <>
                    {/* Book a Table CTA */}
                    <a
                      href={`https://www.thefork.com/search?q=${encodeURIComponent(place.name_en + ' ' + city.name)}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                    >
                      <Utensils className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Book a Table</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Find on Google Maps */}
                    {place.geo && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.name_en} ${city.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>View on Map</span>
                      </a>
                    )}
                  </>
                )}

                {isSight && (
                  <>
                    {/* Get Tickets CTA */}
                    <a
                      href={`https://www.getyourguide.com/s/?q=${encodeURIComponent(place.name_en + ' ' + city.name)}&partner_id=YOUR_ID`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                    >
                      <Ticket className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Get Skip-the-Line Tickets</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Find on Google Maps */}
                    {place.geo && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.geo.lat},${place.geo.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <MapPin className="w-5 h-5" />
                        <span>View Location</span>
                      </a>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Description Body */}
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              {!isComplex ? (
                <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                  {place.description as string}
                </p>
              ) : (
                <div className="space-y-8">
                  
                  {/* Summary */}
                  <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                    {desc.short}
                  </p>

                  {/* History */}
                  {desc.history && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500 p-5 rounded-r-xl not-prose">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">📜</span>
                        <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm uppercase tracking-wider m-0">
                          History & Context
                        </h3>
                      </div>
                      <p className="text-base text-emerald-800 dark:text-emerald-100 m-0 leading-relaxed">
                        {desc.history}
                      </p>
                    </div>
                  )}

                  {/* Insider Tip */}
                  {desc.insider_tip && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-5 rounded-r-xl not-prose">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">💡</span>
                        <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm uppercase tracking-wider m-0">
                          Insider Tip
                        </h3>
                      </div>
                      <p className="text-base text-blue-800 dark:text-blue-100 m-0 leading-relaxed">
                        {desc.insider_tip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Generic Staple Banner */}
            {isGenericStaple && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                <p className="text-base text-amber-900 dark:text-amber-200 leading-relaxed">
                  <span className="font-bold block mb-2 text-amber-950 dark:text-amber-100 uppercase tracking-wide text-sm">
                    ⚠️ Cultural Staple
                  </span> 
                  This page describes a cultural tradition found throughout {city.name}, not a specific single location. 
                  Check the <strong>Community Tips</strong> below for the best current recommendations!
                </p>
              </div>
            )}

            {/* Location Card */}
            {showLocationSection && place.geo && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900 dark:text-slate-100 mb-2">Location</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      <div>
                        <span className="font-medium">Coordinates:</span>{' '}
                        {place.geo.lat.toFixed(4)}, {place.geo.lng.toFixed(4)}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {city.name}, {city.country}
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${place.geo.lat},${place.geo.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                    >
                      Open in Google Maps
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ SMART NEARBY SECTION (Distance-Based) */}
            {nearbyPlaces && nearbyPlaces.length > 0 && (
              <div className="mt-16 mb-12 border-t border-slate-200 dark:border-slate-800 pt-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {place.geo ? 'Nearby' : 'More to explore in'} {city.name}
                  </h3>
                  <Link 
                    href={`/${citySlug}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {nearbyPlaces.slice(0, 3).map((item: any) => (
                    <Link 
                      key={item.slug}
                      href={`/${citySlug}/${item.slug}`}
                      className="group block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg"
                    >
                      <div className="aspect-video relative bg-slate-200 dark:bg-slate-800">
                        <Image 
                          src={item.image} 
                          alt={item.name_en}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.name_en}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {item.category === 'food' ? '🍽️ Must Eat' : '🏛️ Must See'}
                          </span>
                          {item.distance && (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              {item.distance.toFixed(1)} km away
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ SAME CATEGORY SECTION (More Food / More Sights) */}
            {sameCategoryPlaces && sameCategoryPlaces.length > 0 && (
              <div className="mb-12 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    More {isFood ? 'Food' : 'Attractions'} in {city.name}
                  </h3>
                  <Link 
                    href={`/${citySlug}#${isFood ? 'must-eat' : 'must-see'}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                  >
                    View all {isFood ? 'restaurants' : 'attractions'} →
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sameCategoryPlaces.map((item) => (
                    <Link 
                      key={item.slug}
                      href={`/${citySlug}/${item.slug}`}
                      className="group block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg"
                    >
                      <div className="aspect-video relative bg-slate-200 dark:bg-slate-800">
                        <Image 
                          src={item.image} 
                          alt={item.name_en}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {item.name_en}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.name_local}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ PROMINENT BACK TO CITY GUIDE (Before Comments) */}
            <div className="my-12 bg-white dark:bg-slate-900 rounded-xl border-2 border-indigo-200 dark:border-indigo-800 p-6 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3">
                Ready to explore more of {city.name}?
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Discover all the essential food spots, must-see attractions, and local tips in our complete city guide.
              </p>
              <Link 
                href={`/${citySlug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {city.name} Complete Guide
              </Link>
            </div>

            {/* Community Tips */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Community Tips & Reviews
              </h2>
              <CommentThread citySlug={citySlug} placeSlug={placeSlug} />
            </div>
          </div>

          {/* Sidebar */}
          {showLocationSection && (
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <AdContainer slot="sidebar" />
                
                {/* Quick Info Card */}
                {isComplex && (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4 text-sm uppercase tracking-wider">
                      Quick Info
                    </h3>
                    <div className="space-y-3 text-sm">
                      {desc.price_level && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Price</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{desc.price_level}</span>
                        </div>
                      )}
                      {desc.duration && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Duration</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{desc.duration}</span>
                        </div>
                      )}
                      {desc.best_time && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600 dark:text-slate-400">Best Time</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{desc.best_time}</span>
                        </div>
                      )}
                      {desc.good_for && desc.good_for.length > 0 && (
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                          <div className="text-slate-600 dark:text-slate-400 mb-2">Good for</div>
                          <div className="flex flex-wrap gap-2">
                            {desc.good_for.map((tag: string) => (
                              <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    </div>
  )
}
