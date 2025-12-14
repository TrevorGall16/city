/**
 * Place Detail Page (SSG)
 * Following 03_UI and implementation plan specifications
 * Fixed for Next.js 16+ (params is now a Promise)
 */
import { SaveButton } from '@/components/features/SaveButton'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import { MapPin } from 'lucide-react'
import type { City, Place } from '@/types'
import { TranslationHook } from '@/components/features/TranslationHook'
import { AdContainer } from '@/components/ads/AdContainer'
import { CommentThread } from '@/components/features/CommentThread'
import type { Metadata } from 'next'

// Type definition for Page Props in Next.js 15+
interface PageProps {
  params: Promise<{ citySlug: string; placeSlug: string }>
}

async function getPlaceData(
  citySlug: string,
  placeSlug: string
): Promise<{ city: City; place: Place; otherPlaces: Place[] } | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${citySlug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const city: City = JSON.parse(fileContent)

    const mustSeeItems = city.must_see.flatMap(group => group.items)
    const allPlaces = [...city.must_eat, ...mustSeeItems]
    
    const place = allPlaces.find(p => p.slug === placeSlug)
    
    // ✅ Filter: Get 3 other places that are NOT the current one
    const otherPlaces = allPlaces
      .filter(p => p.slug !== placeSlug)
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3) // Take 3 random items

    if (!place) return null

    return { city, place, otherPlaces }
  } catch {
    return null
  }
}

// SSG: Generate static params for all places
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

// SEO: Generate metadata for each place
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug)

  if (!data) {
    return {
      title: 'Place Not Found',
    }
  }

  const { city, place } = data

  return {
    title: `${place.name_en} (${place.name_local}) in ${city.name} – Tips & Translation`,
    description: `Visit ${place.name_en} in ${city.name}. Local translation: ${place.name_local}. ${place.description}`,
  }
}

export default async function PlacePage({ params }: PageProps) {
  const { citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug)

  if (!data) {
    notFound()
  }

  // ✅ CORRECT EXTRACTION: We now get otherPlaces too
  const { city, place, otherPlaces } = data
  
  const showTranslation = place.name_local && place.name_local !== place.name_en
  const isGenericStaple = place.is_generic_staple
  const showLocationSection = !isGenericStaple && place.geo

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          {' / '}
          <Link
            href={`/city/${city.slug}`}
            className="hover:text-indigo-600 transition-colors"
          >
            {city.name}
          </Link>
          {' / '}
          <span className="text-slate-900 dark:text-slate-200">{place.name_en}</span>
        </nav>

        <div className={`grid grid-cols-1 gap-8 ${showLocationSection ? 'lg:grid-cols-3' : ''}`}>
          {/* Main Content */}
          <div className={showLocationSection ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}>
            {/* Hero Image */}
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-6 bg-slate-200 dark:bg-slate-800">
              <Image
                src={place.image}
                alt={place.name_en}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {/* Title + Save Button */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {place.name_en}
              </h1>
              <div className="mt-2">
                <SaveButton 
                  placeSlug={place.slug} 
                  citySlug={city.slug} 
                  variant="default"
                />
              </div>
            </div>

            {/* Translation Hook */}
            {showTranslation && (
              <TranslationHook
                text={place.name_local}
                placeName={place.name_en}
                className="mb-6"
              />
            )}

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                {place.category === 'food' ? 'Must Eat' : 'Must See'}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                {place.description}
              </p>
            </div>

            {/* Generic Staple Info Banner */}
            {isGenericStaple && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-900 dark:text-amber-200">
                  <span className="font-medium">Cultural Staple:</span> This represents a cultural tradition or style found throughout {city.name}, not a specific location. Check the Community Tips below for recommendations on where to experience this!
                </p>
              </div>
            )}

            {/* Location Card */}
            {showLocationSection && place.geo && (
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
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
                      className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ NEW SECTION: Nearby Places / Internal Linking */}
            {otherPlaces && otherPlaces.length > 0 && (
              <div className="mt-12 mb-12 border-t border-slate-200 dark:border-slate-800 pt-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                  More to explore in {city.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {otherPlaces.map((item) => (
                    <Link 
                      key={item.slug}
                      href={`/city/${city.slug}/${item.slug}`}
                      className="group block bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                    >
                      <div className="aspect-video relative bg-slate-200 dark:bg-slate-800">
                        <Image 
                          src={item.image} 
                          alt={item.name_en}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors truncate">
                          {item.name_en}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.category === 'food' ? 'Must Eat' : 'Must See'}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Community Tips - LIVE */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                Community Tips
              </h2>
              <CommentThread citySlug={city.slug} placeSlug={place.slug} />
            </div>
          </div>

          {/* Sidebar */}
          {showLocationSection && (
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <AdContainer slot="sidebar" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}