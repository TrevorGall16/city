// src/app/favorites/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EnhancedPlaceCard } from '@/components/features/EnhancedPlaceCard' 
import { Heart, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface FavoritePlace {
  place_id: string;
  city_slug: string;
  name_en: string; 
  description: string;
  image: string;
  slug: string;
}

export default function FavoritesPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<FavoritePlace[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/sign-in?redirect=/favorites')
      return
    }

    // 2. Fetch saved IDs
    const { data: favoriteIds, error: favoritesError } = await supabase
      .from('favorites')
      .select('place_id, city_slug')
      .eq('user_id', user.id)

    if (favoritesError) {
      setError('Failed to load favorites.')
      setLoading(false)
      return
    }
    
    if (!favoriteIds || favoriteIds.length === 0) {
      setFavorites([])
      setLoading(false)
      return
    }
    
    // 3. Fetch details from 'places' table
    const placeIdList = favoriteIds.map(f => f.place_id)
    
    const { data: placeDetails, error: placesError } = await supabase
      .from('places')
      .select('id, name_en, description, image, slug')
      .in('id', placeIdList)
      
    if (placesError) {
      setError('Could not retrieve place details.')
      setLoading(false)
      return
    }
    
    // 4. Merge data
    const combinedFavorites = favoriteIds.map(fav => {
        const detail = placeDetails?.find(p => p.id === fav.place_id)
        return {
            ...fav,
            name_en: detail?.name_en || 'Unknown Place',
            description: detail?.description || 'Details unavailable.',
            image: detail?.image || '/placeholder.jpg',
            slug: detail?.slug || '#',
        } as FavoritePlace
    })

    setFavorites(combinedFavorites)
    setLoading(false)

  }, [router, supabase])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 fill-red-500 text-red-500" /> 
          My Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No saved places yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Start exploring cities and save the places you love!
            </p>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Explore Cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <EnhancedPlaceCard 
                key={fav.place_id} 
                citySlug={fav.city_slug}
                place={{ 
                  id: fav.place_id, 
                  slug: fav.slug,
                  name_en: fav.name_en,
                  description: fav.description,
                  image: fav.image,
                  name_local: fav.name_en, 
                  category: 'saved',
                } as any} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}