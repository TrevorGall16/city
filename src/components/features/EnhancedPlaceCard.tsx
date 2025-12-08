/**
 * Enhanced PlaceCard Component
 * Includes database-backed favorites with authentication
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { TranslationHook } from './TranslationHook'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/Toast'
import type { Place } from '@/types'

interface EnhancedPlaceCardProps {
  place: Place
  citySlug: string
}

export function EnhancedPlaceCard({ place, citySlug }: EnhancedPlaceCardProps) {
  const supabase = createClient()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'info' } | null>(null)
  const showTranslation = place.name_local && place.name_local !== place.name_en

  // Check authentication and load favorite status
  useEffect(() => {
    async function loadFavoriteStatus() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setIsAuthenticated(!!user)

      if (user) {
        // Load favorite status from database
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('place_id', place.id)
          .single()

        setIsFavorite(!!data)
      }

      setLoading(false)
    }

    loadFavoriteStatus()
  }, [place.id, supabase])

  // Toggle favorite
  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Check authentication first
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Show toast: user must log in
      setToast({
        message: 'Please log in to save favorites',
        type: 'info',
      })
      return
    }

    // User is authenticated, toggle favorite in database
    if (isFavorite) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('place_id', place.id)

      if (!error) {
        setIsFavorite(false)
      } else {
        console.error('Error removing favorite:', error)
        setToast({
          message: 'Failed to remove favorite. Please try again.',
          type: 'error',
        })
      }
    } else {
      // Add favorite
      const { error } = await supabase.from('favorites').insert({
        user_id: user.id,
        place_id: place.id,
        city_slug: citySlug,
      })

      if (!error) {
        setIsFavorite(true)
      } else {
        console.error('Error adding favorite:', error)
        setToast({
          message: 'Failed to add favorite. Please try again.',
          type: 'error',
        })
      }
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 ease-out relative">
        {/* Favorite Heart Button */}
        <button
          onClick={toggleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          />
        </button>

        {/* Image */}
        <Link href={`/city/${citySlug}/${place.slug}`}>
          <div className="aspect-[4/3] relative overflow-hidden group">
            <Image
              src={place.image}
              alt={place.name_en}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        {/* Body */}
        <div className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Link href={`/city/${citySlug}/${place.slug}`}>
            <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {place.name_en}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
            {place.description}
          </p>

          {/* Translation Hook - CRITICAL FEATURE */}
          {showTranslation && (
            <div className="mt-4">
              <TranslationHook text={place.name_local} />
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
