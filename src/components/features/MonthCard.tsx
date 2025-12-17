'use client'

import { Cloud, Sun, CloudRain, Snowflake, Wind, Shirt, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { WeatherMonth } from '@/types'

interface MonthCardProps {
  month: WeatherMonth
  isCurrent?: boolean
}

export function MonthCard({ month, isCurrent = false }: MonthCardProps) {
  // 1. Seasonal Color Logic based on month name
  const getSeasonStyles = (name: string) => {
    const m = name.toLowerCase()
    
    // Winter (Cold) -> Blue
    if (['dec', 'jan', 'feb'].some(s => m.includes(s))) {
      return isCurrent 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 ring-1 ring-blue-500' 
        : 'bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-4 border-t-blue-400'
    }
    // Spring (Mild) -> Green
    if (['mar', 'apr', 'may'].some(s => m.includes(s))) {
      return isCurrent 
        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500' 
        : 'bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-4 border-t-emerald-400'
    }
    // Summer (Hot) -> Red/Orange
    if (['jun', 'jul', 'aug'].some(s => m.includes(s))) {
      return isCurrent 
        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 ring-1 ring-orange-500' 
        : 'bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-4 border-t-orange-400'
    }
    // Autumn (Cool) -> Amber
    return isCurrent 
      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 ring-1 ring-amber-500' 
      : 'bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 border-t-4 border-t-amber-400'
  }

  // 2. Icon Logic (Safe Check)
  const getIcon = (condition: string = '') => {
    const c = condition.toLowerCase()
    if (c.includes('rain') || c.includes('wet')) return <CloudRain className="w-5 h-5 text-blue-500" />
    if (c.includes('snow') || c.includes('cold')) return <Snowflake className="w-5 h-5 text-cyan-500" />
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="w-5 h-5 text-slate-400" />
    if (c.includes('wind')) return <Wind className="w-5 h-5 text-slate-400" />
    return <Sun className="w-5 h-5 text-amber-500" />
  }

  const seasonClass = getSeasonStyles(month.name)

  return (
    <div 
      className={`
        flex flex-col p-4 rounded-xl border shadow-sm transition-all duration-300
        ${seasonClass}
        ${isCurrent ? 'transform scale-[1.02] shadow-md z-10' : 'hover:shadow-md hover:-translate-y-1 border-slate-100 dark:border-slate-800'}
      `}
    >
      {/* Header: Name, Icon, Temp */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-xs">
            {month.name.slice(0, 3)}
          </h4>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
            {month.temp}
          </span>
        </div>
        <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm">
          {getIcon(month.condition)}
        </div>
      </div>

      {/* Vibe Pill */}
      {month.vibe && (
        <div className="mb-4">
          <span className="inline-block px-2 py-0.5 bg-white/80 dark:bg-black/30 rounded text-[10px] font-medium text-slate-600 dark:text-slate-300">
            {month.vibe}
          </span>
        </div>
      )}

      {/* Tips Section (Restored) */}
      <div className="mt-auto space-y-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
        {/* Clothing Tip */}
        {month.clothing && (
          <div className="flex items-start gap-1.5">
            <Shirt className="w-3 h-3 mt-0.5 text-indigo-500 flex-shrink-0" />
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight">
              {month.clothing}
            </p>
          </div>
        )}

        {/* Pro Tip (First item only) */}
        {month.pros && month.pros.length > 0 && (
          <div className="flex items-start gap-1.5">
            <ThumbsUp className="w-3 h-3 mt-0.5 text-emerald-600 flex-shrink-0" />
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight line-clamp-2">
              {month.pros[0]}
            </p>
          </div>
        )}

        {/* Con Tip (First item only) */}
        {month.cons && month.cons.length > 0 && (
          <div className="flex items-start gap-1.5">
            <ThumbsDown className="w-3 h-3 mt-0.5 text-red-500 flex-shrink-0" />
            <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight line-clamp-2">
              {month.cons[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}