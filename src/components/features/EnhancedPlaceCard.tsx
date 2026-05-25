/**
 * 🛰️ MASTER AI: ENHANCED PLACE CARD (GOLDEN MASTER V6.1 - HYDRATION & IMAGE FIX)
 * ✅ Feature: Kept Large Localized Subtitle (25px) & TranslationHook.
 * ✅ Fix: Handles "Object as Child" Runtime Error for translated descriptions.
 * ✅ Fix: Bulletproof Image Fallback with onError & z-index to fix "invisible" images.
 * ✅ Layout: 2026 Editorial Aspect Ratio (16/10) for a tighter grid.
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TranslationHook } from './TranslationHook'
import type { Place } from '@/types'

interface EnhancedPlaceCardProps {
  place: Place
  citySlug: string
  lang: string
  dict: any
  index?: number
}

export function EnhancedPlaceCard({ place, citySlug, lang, dict, index = 0 }: EnhancedPlaceCardProps) {
  // 🛡️ SAFETY 1: Check for valid image string
  const hasValidImage = !!(place.image && place.image.trim() !== "");
  
  // 🛡️ SAFETY 2: Handle "Object as React Child" Runtime Error
  const isComplexDesc = typeof place.description === 'object' && place.description !== null;
  const descriptionText = isComplexDesc 
    ? (place.description as any).short || (place.description as any).vibe || ""
    : (place.description as any) || "";

  // 🛡️ STRATEGY: Readability Mix
  const mainTitle = place.name_en; 
  const localSubtitle = place.name_local && place.name_local !== place.name_en ? place.name_local : null;
  const showTranslation = !!localSubtitle;
  const detailUrl = `/${lang}/city/${citySlug}/${place.slug}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 h-full flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
      
      {/* Cinematic Image Link with Multi-Layer Safety Fallback */}
      <Link href={detailUrl} className="block aspect-[16/10] relative overflow-hidden bg-slate-200 dark:bg-slate-800">
<Image
  src={hasValidImage ? place.image : "/images/placeholders/fallback.jpg"}
  alt={place.name_en}
  fill
  className="object-cover z-10"
  sizes="(max-width: 768px) 100vw, 33vw"
  priority={index === 0}
  loading={index === 0 ? undefined : 'lazy'}
  onError={(e) => {
    e.currentTarget.src = "/images/placeholders/fallback.jpg";
    e.currentTarget.srcset = ""; // Clears responsive sets that might override the fallback
  }}
/>
        {/* Editorial Overlay: Only visible if the primary image is missing in the JSON */}
        {!hasValidImage && (
          <div className="absolute inset-0 z-20 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
             <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black/30 px-3 py-1 rounded-full border border-white/20">
               Photo Coming Soon
             </span>
          </div>
        )}
      </Link>
      
      <div className="p-6 flex-1 flex flex-col">
        {/* Dual-Language Titles */}
        <Link href={detailUrl} className="block mb-4">
          <h3 className="text-xl font-black text-slate-950 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
            {mainTitle}
          </h3>
          {localSubtitle && (
            <p className="text-[25px] font-bold text-slate-500 dark:text-slate-400 mt-1 italic leading-none">
              {localSubtitle}
            </p>
          )}
        </Link>

        {/* Short Summary - Safety Checked */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
          {descriptionText}
        </p>

        {/* Translation Toggle & Footer Hook */}
        <div className="mt-auto space-y-4">
          {showTranslation && (
            <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50">
              <TranslationHook text={place.name_local ?? place.name_en} />
            </div>
          )}
          
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
            <span className="text-emerald-600 font-bold">{place.price_level}</span>
            <span className="text-indigo-600 font-bold">{dict.view_details || 'Details'} →</span>
          </div>
        </div>
      </div>
    </div>
  )
}