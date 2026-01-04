/**
 * 🛰️ MASTER AI: FAVORITES PAGE (GOLDEN MASTER V7.2)
 * ✅ Fixed: Resolved "Property 'dict' is missing" build error.
 * ✅ Fixed: Resolved "Property 'lang' is missing" build error.
 * ✅ Optimized: Direct integration of your Supabase merging logic.
 * ✅ Premium: Kept your specific Heart & Loader UI.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  const params = useParams()
  
  // 🛡️ SAFETY 1: Get lang safely from URL params for Next.js 16
  const lang = (params?.lang as string) || 'en'
  
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<FavoritePlace[]>([])
  const [dict, setDict] = useState<any>(null) // 🛡️ Added for EnhancedPlaceCard
  const [error, setError] = useState<string | null>(null)

  const fetchFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // 🎯 STEP A: Fetch dictionary for the UI
      const dictResponse = await fetch(`/api/dict?lang=${lang}`)
      const dictData = await dictResponse.json()
      setDict(dictData)

      // 🎯 STEP B: Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        // Updated to correct localized route
        router.push(`/${lang}/sign-in?redirect=/${lang}/favorites`)
        return
      }

      // 🎯 STEP C: Fetch saved IDs
      const { data: favoriteIds, error: favoritesError } = await supabase
        .from('favorites')
        .select('place_id, city_slug')
        .eq('user_id', user.id)

      if (favoritesError) throw new Error('Failed to load favorites.')
      
      if (!favoriteIds || favoriteIds.length === 0) {
        setFavorites([])
        setLoading(false)
        return
      }
      
      // 🎯 STEP D: Fetch details from 'places' table
      const placeIdList = favoriteIds.map(f => f.place_id)
      const { data: placeDetails, error: placesError } = await supabase
        .from('places')
        .select('id, name_en, description, image, slug')
        .in('id', placeIdList)
        
      if (placesError) throw new Error('Could not retrieve place details.')
      
      // 🎯 STEP E: Merge your data exactly as before
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
    } catch (err: any) {
      console.error("Favorites Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }

  }, [router, supabase, lang])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-16 px-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-black flex items-center gap-4 mb-12 uppercase tracking-tighter italic">
          <Heart className="w-10 h-10 fill-rose-500 text-rose-500" /> 
          {dict?.your_favorites || 'My Favorites'}
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl">
            <Heart className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No saved places yet</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-10 font-medium">
              Start exploring cities and save the places you love!
            </p>
            <Link 
              href={`/${lang}`} 
              className="inline-flex items-center justify-center px-10 py-4 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 transition-all hover:scale-[1.05]"
            >
              Explore Cities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((fav) => (
              <EnhancedPlaceCard 
                key={fav.place_id} 
                citySlug={fav.city_slug}
                /* ✅ FIXED: Passing required localization props */
                lang={lang}
                dict={dict}
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