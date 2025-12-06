/**
 * Place Detail Page (SSG)
 * Following 03_UI and implementation plan specifications
 * Fixed for Next.js 16+ (params is now a Promise)
 */

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
): Promise<{ city: City; place: Place } | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${citySlug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const city: City = JSON.parse(fileContent)

    const mustSeeItems = city.must_see.flatMap(group => group.items)
    const allPlaces = [...city.must_eat, ...mustSeeItems]
    const place = allPlaces.find(p => p.slug === placeSlug)

    if (!place) return null

    return { city, place }
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
  // Await params before accessing properties
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
  // Await params before accessing properties
  const { citySlug, placeSlug } = await params
  const data = await getPlaceData(citySlug, placeSlug)

  if (!data) {
    notFound()
  }

  const { city, place } = data
  const showTranslation = place.name_local && place.name_local !== place.name_en
  const isGenericStaple = place.is_generic_staple
  const showLocationSection = !isGenericStaple && place.geo

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-slate-600 mb-6">
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
          <span className="text-slate-900">{place.name_en}</span>
        </nav>

        <div className={`grid grid-cols-1 gap-8 ${showLocationSection ? 'lg:grid-cols-3' : ''}`}>
          {/* Main Content */}
          <div className={showLocationSection ? 'lg:col-span-2' : 'max-w-4xl mx-auto w-full'}>
            {/* Hero Image */}
            <div className="aspect-[16/9] relative rounded-xl overflow-hidden mb-6">
              <Image
                src={place.image}
                alt={place.name_en}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              {place.name_en}
            </h1>

            {/* Translation Hook - THE CORE FEATURE */}
            {showTranslation && (
              <TranslationHook
                text={place.name_local}
                placeName={place.name_en}
                className="mb-6"
              />
            )}

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                {place.category === 'food' ? 'Must Eat' : 'Must See'}
              </span>
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none mb-8">
              <p className="text-lg leading-relaxed text-slate-600">
                {place.description}
              </p>
            </div>

            {/* Generic Staple Info Banner */}
            {isGenericStaple && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <p className="text-sm text-amber-900">
                  <span className="font-medium">Cultural Staple:</span> This represents a cultural tradition or style found throughout {city.name}, not a specific location. Check the Community Tips below for recommendations on where to experience this!
                </p>
              </div>
            )}

            {/* Location Card - Only show for specific locations */}
            {showLocationSection && place.geo && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-slate-900 mb-2">Location</div>
                    <div className="text-sm text-slate-600 space-y-1">
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
                      className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Community Tips - LIVE */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Community Tips
              </h2>
              <CommentThread citySlug={city.slug} placeSlug={place.slug} />
            </div>
          </div>

          {/* Sidebar - Only show for specific locations with map */}
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
