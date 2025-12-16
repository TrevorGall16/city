'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TranslationHook } from './TranslationHook'
import type { Place } from '@/types'

interface EnhancedPlaceCardProps {
  place: Place
  citySlug: string
}

export function EnhancedPlaceCard({ place, citySlug }: EnhancedPlaceCardProps) {
  const showTranslation = place.name_local && place.name_local !== place.name_en

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.98] transition-all duration-200 ease-out relative group">
      
      {/* Image */}
      <Link href={`/city/${citySlug}/${place.slug}`}>
        <div className="aspect-[4/3] relative overflow-hidden">
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
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <Link href={`/city/${citySlug}/${place.slug}`}>
          <h3 className="text-lg font-semibold leading-tight text-slate-900 dark:text-slate-50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {place.name_en}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">
          {place.description}
        </p>

        {/* Translation Hook */}
        {showTranslation && (
          <div className="mt-4">
            <TranslationHook text={place.name_local} />
          </div>
        )}
      </div>
    </div>
  )
}