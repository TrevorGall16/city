/**
 * City Places Section
 * Client-side wrapper for filtering and displaying places
 */

'use client'

import { useState, useEffect } from 'react'
import { EnhancedPlaceCard } from './EnhancedPlaceCard'
import { CategoryFilter, type FilterCategory } from './CategoryFilter'
import type { Place } from '@/types'

interface CityPlacesSectionProps {
  places: Place[]
  citySlug: string
  sectionTitle: string
  sectionId: string
  accentText?: string // Country-specific text color for section header
  lang: string // ✅ Correctly defined in Interface
  dict: any // 🎯 Ensure this is here
}

// Extract unique category tags from places
function extractAvailableTags(places: Place[]): string[] {
  const tags = new Set<string>()

  places.forEach((place) => {
    // Use the category field as the primary tag
    if (place.category) {
      tags.add(place.category)
    }
  })

  return Array.from(tags).sort()
}

export function CityPlacesSection({
  places,
  citySlug,
  sectionTitle,
  sectionId,
  accentText,
  lang,
  dict,
}: CityPlacesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([])

  const availableTags = extractAvailableTags(places)
  const headerColor = accentText || 'text-indigo-900 dark:text-white'

  useEffect(() => {
    let cancelled = false

    async function loadFavorites() {
      try {
        const url = new URL('/api/favorites', window.location.origin)
        url.searchParams.set('citySlug', citySlug)
        const res = await fetch(url.toString(), { credentials: 'include' })
        if (!res.ok) return
        const payload = await res.json()
        if (cancelled) return
        const slugs = Array.isArray(payload.items)
          ? payload.items.map((item: any) => item.place_slug).filter(Boolean)
          : []
        setFavoriteSlugs(slugs)
      } catch {
        // silent — favorites UI is a progressive enhancement
      }
    }

    loadFavorites()
    return () => {
      cancelled = true
    }
  }, [citySlug])

  const filteredPlaces = places.filter((place) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'favorites') return favoriteSlugs.includes(place.slug)

    return place.category && place.category.toLowerCase() === activeFilter.toLowerCase()
  })

  return (
    <>
      {/* Category Filter */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        availableTags={availableTags}
        showFavoritesFilter={true}
      />

      {/* Places Grid */}
      <section
        id={sectionId}
        className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-slate-50 dark:bg-slate-900"
      >
        <div className="mb-8">
          <h2 className={`text-4xl md:text-5xl font-bold ${headerColor} mb-2`}>
            {sectionTitle}
          </h2>
          {activeFilter !== 'all' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Showing {filteredPlaces.length} of {places.length} places
            </p>
          )}
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No places found for this filter.
            </p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Show all places
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {filteredPlaces.map((place, i) => (
<EnhancedPlaceCard
  key={place.id}
  place={place}
  citySlug={citySlug}
  lang={lang}
  dict={dict}
  index={i}
/>
            ))}
          </div>
        )}
      </section>
    </>
  )
}