/**
 * Enhanced PlaceCard Component
 * Includes favorites (localStorage) and Google Maps directions
 */

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { TranslationHook } from './TranslationHook'
import type { Place } from '@/types'

interface EnhancedPlaceCardProps {
  place: Place
  citySlug: string
}

export function EnhancedPlaceCard({ place, citySlug }: EnhancedPlaceCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const showTranslation = place.name_local && place.name_local !== place.name_en

  // Load favorite status from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('citysheet-favorites') || '[]')
    setIsFavorite(favorites.includes(place.id))
  }, [place.id])

  // Toggle favorite
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const favorites = JSON.parse(localStorage.getItem('citysheet-favorites') || '[]')
    const newFavorites = isFavorite
      ? favorites.filter((id: string) => id !== place.id)
      : [...favorites, place.id]

    localStorage.setItem('citysheet-favorites', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 ease-out relative">
      {/* Favorite Heart Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
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
  )
}
