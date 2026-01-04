/**
 * 🛰️ MASTER AI: CITY CARD GOLDEN MASTER (V5.0)
 * ✅ Navigation: Uses Next.js Link for instant, reliable loading.
 * ✅ Design: Smaller, flatter, and more "tightened" for the 2-column grid.
 * ✅ Localization: Correctly routes to /[lang]/city/[slug].
 */

'use client'

import Link from 'next/link'
import Image from 'next/image'

interface CityCardProps {
  name: string
  country: string
  image: string
  slug: string
  lang: string
}

export function CityCard({ name, country, image, slug, lang }: CityCardProps) {
  // ✅ ROUTE CONSTRUCTION: Ensures the user goes to the correct localized page
  const cityUrl = `/${lang}/city/${slug}`

  return (
    <Link 
      href={cityUrl}
      className="group relative block w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-900 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Image Container: Fixed Aspect Ratio for a "Tight" Grid */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-85" />
      </div>

      {/* Content Overlay: Simplified & Professional */}
      <div className="absolute bottom-0 left-0 p-4 w-full">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mb-1">
          {country}
        </p>
        <h3 className="text-xl font-bold text-white tracking-tight uppercase leading-none">
          {name}
        </h3>
      </div>
      
      {/* Interaction Indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-[8px] font-black text-white uppercase tracking-widest">
          Explore →
        </div>
      </div>
    </Link>
  )
}