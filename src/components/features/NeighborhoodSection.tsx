/**
 * 🛰️ MASTER AI: INTERACTIVE NEIGHBORHOODS GOLDEN MASTER (V2.0)
 * ✅ Stability: Fixed ".map is not a function" with Array.isArray guard.
 * ✅ Design: Kept Cinematic cards with aspect-[4/3] and 2026 Silk Blur modals.
 * ✅ Features: Kept Booking.com affiliate integration and Modal expansion.
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, Hotel, MapPin, ExternalLink } from 'lucide-react'

interface NeighborhoodSectionProps {
  neighborhoods: any[]
  dict: any
  cityName: string
}

export function NeighborhoodSection({ neighborhoods, dict, cityName }: NeighborhoodSectionProps) {
  const [activeHood, setActiveHood] = useState<any | null>(null)
  const d = dict || {}

  // 🛡️ CRITICAL SAFETY GUARD: Prevent crash if neighborhoods is not an array (Japanese data fix)
  const safeNeighborhoods = Array.isArray(neighborhoods) ? neighborhoods : []

  if (safeNeighborhoods.length === 0) {
    return (
      <div className="py-20 text-center bg-slate-50 dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          {d.no_data || 'Neighborhood data coming soon...'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {safeNeighborhoods.map((hood, idx) => (
          <div 
            key={idx} 
            onClick={() => setActiveHood(hood)}
            className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/3] shadow-lg border-4 border-white dark:border-slate-900 cursor-pointer hover:shadow-2xl transition-all duration-500"
          >
            {/* Optimized Image Logic */}
            {hood.image ? (
              <Image 
                src={hood.image} 
                alt={hood.name} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            ) : (
              <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent p-8 flex flex-col justify-end">
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">
                {d.view_details || 'View Details'}
              </span>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">{hood.name}</h3>
              <p className="text-white/80 text-sm line-clamp-2 leading-relaxed font-medium">
                {typeof hood.description === 'object' ? hood.description.short : hood.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal: 2026 Silk Blur Edition */}
      {activeHood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-500">
          <div 
            className="absolute inset-0" 
            onClick={() => setActiveHood(null)} 
          />
          <div className="relative bg-white dark:bg-slate-950 w-full max-w-5xl rounded-[4rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row border border-white/10 animate-in zoom-in-95 duration-500">
            
            {/* Visual Side */}
            <div className="md:w-1/2 relative h-72 md:h-auto overflow-hidden">
              {activeHood.image && (
                <Image 
                  src={activeHood.image} 
                  alt={activeHood.name} 
                  fill 
                  className="object-cover" 
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              <div className="absolute top-8 left-8">
                 <div className="bg-white/95 backdrop-blur px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{cityName}</span>
                 </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    {activeHood.name}
                  </h2>
                  <div className="h-1 w-12 bg-indigo-600 mt-6 rounded-full" />
                </div>
                <button 
                  onClick={() => setActiveHood(null)}
                  className="p-4 bg-slate-100 dark:bg-slate-900 hover:bg-rose-500 hover:text-white rounded-2xl transition-all group"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow">
                <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                  "{typeof activeHood.description === 'object' ? activeHood.description.full || activeHood.description.short : activeHood.description}"
                </p>
              </div>

              {/* Affiliate Action */}
              <div className="mt-12">
                <a 
                  href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(activeHood.name + ' ' + cityName)}&aid=YOUR_ID`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] flex items-center justify-center gap-4 font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Hotel className="w-5 h-5" />
                  {d.check_hotels || 'Find Hotels in this Area'}
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}