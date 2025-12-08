/**
 * City Places Section
 * Client-side wrapper for filtering and displaying places
 */

'use client'

import { useState, useEffect } from 'react'
import { EnhancedPlaceCard } from './EnhancedPlaceCard'
import { CategoryFilter, type FilterCategory } from './CategoryFilter'
import { createClient } from '@/lib/supabase/client'
import type { Place } from '@/types'

interface CityPlacesSectionProps {
  places: Place[]
  citySlug: string
  sectionTitle: string
  sectionId: string
}

// Map place categories to filter categories
function getPlaceFilterCategory(place: Place): FilterCategory[] {
  const categories: FilterCategory[] = []

  // Check if it's a museum based on name
  if (
    place.name_en.toLowerCase().includes('museum') ||
    place.name_en.toLowerCase().includes('musée')
  ) {
    categories.push('museum')
  }

  // Check if it's a landmark
  if (
    place.name_en.toLowerCase().includes('tower') ||
    place.name_en.toLowerCase().includes('arc') ||
    place.name_en.toLowerCase().includes('pantheon') ||
    place.name_en.toLowerCase().includes('cathedral') ||
    place.name_en.toLowerCase().includes('basilica') ||
    place.category === 'sight'
  ) {
    categories.push('landmark')
  }

  // Food items
  if (place.category === 'food') {
    categories.push('food')
  }

  // Hidden gems (places without geo data or generic staples)
  if (!place.geo || place.is_generic_staple) {
    categories.push('hidden-gem')
  }

  return categories.length > 0 ? categories : ['landmark']
}

export function CityPlacesSection({
  places,
  citySlug,
  sectionTitle,
  sectionId,
}: CityPlacesSectionProps) {
  const supabase = createClient()
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')
  const [favorites, setFavorites] = useState<string[]>([])

  // Load favorites from database
  useEffect(() => {
    async function loadFavorites() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', user.id)

        if (data) {
          setFavorites(data.map((fav) => fav.place_id))
        }
      }
    }

    loadFavorites()
  }, [supabase])

  // Re-check favorites periodically (in case they change)
  useEffect(() => {
    const interval = setInterval(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('place_id')
          .eq('user_id', user.id)

        if (data) {
          setFavorites(data.map((fav) => fav.place_id))
        }
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [supabase])

  // Filter places based on active filter
  const filteredPlaces = places.filter((place) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'favorites') return favorites.includes(place.id)

    const placeCategories = getPlaceFilterCategory(place)
    return placeCategories.includes(activeFilter)
  })

  return (
    <>
      {/* Category Filter */}
      <CategoryFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        showFavoritesFilter={true}
      />

      {/* Places Grid */}
      <section
        id={sectionId}
        className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-white dark:bg-slate-950"
      >
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-indigo-900 dark:text-white mb-2">
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
            {filteredPlaces.map((place) => (
              <EnhancedPlaceCard
                key={place.id}
                place={place}
                citySlug={citySlug}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
