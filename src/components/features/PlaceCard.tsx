/**
 * PlaceCard Component
 * Following 03_UI strict specifications (section 2.1)
 *
 * Primary unit of content - displays place with Translation Hook
 */

import Image from 'next/image'
import Link from 'next/link'
import { TranslationHook } from './TranslationHook'
import type { Place } from '@/types'

interface PlaceCardProps {
  place: Place
  citySlug: string
}

export function PlaceCard({ place, citySlug }: PlaceCardProps) {
  const showTranslation = place.name_local && place.name_local !== place.name_en

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-out">
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
      <div className="p-4 bg-white border-slate-200">
        <Link href={`/city/${citySlug}/${place.slug}`}>
          <h3 className="text-lg font-semibold leading-tight text-slate-900 hover:text-indigo-600 transition-colors">
            {place.name_en}
          </h3>
        </Link>

        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
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
