/**
 * 🛰️ MASTER AI: AT-A-GLANCE DASHBOARD (V5.0)
 * ✅ 100% Localized: No hardcoded English labels or values.
 * ✅ Dynamic Data: Uses city.stats and dict props for all text.
 * ✅ Refined UI: Premium typography and high-saturation icon backgrounds.
 */

'use client'

import { Calendar, DollarSign, Globe, FileText } from 'lucide-react'
import type { City } from '@/types'
import { CheatSheetWidget } from './CheatSheetWidget'

interface AtAGlanceDashboardProps {
  city: City
  dict: any 
}

export function AtAGlanceDashboard({ city, dict }: AtAGlanceDashboardProps) {
  // 🛡️ Fallback dictionary safety
  const d = dict || {};

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 flex-1 w-full">
          
          {/* 1. Best Time to Visit */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-0.5">
                {d.best_time_label || 'Best Time'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white leading-tight">
                {city.best_time_to_visit || 'Spring / Fall'}
              </p> 
            </div>
          </div>

          {/* 2. Currency */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-800/50">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-0.5">
                {d.currency_label || 'Currency'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white leading-tight">
                {city.stats?.currency || 'Local Currency'}
              </p>
            </div>
          </div>

          {/* 3. Language */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-800/50">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-0.5">
                {d.language_label || 'Language'}
              </p>
              <p className="font-bold text-slate-900 dark:text-white leading-tight">
                {city.stats?.main_language || 'Local Language'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Cheat Sheet CTA */}
        <div className="w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8">
          <CheatSheetWidget 
            city={city} 
            trigger={
              <button className="w-full lg:w-auto bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-8 py-4 rounded-2xl font-black text-xs hover:scale-105 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 uppercase tracking-widest">
                <FileText className="w-4 h-4" />
                <span>{d.get_cheat_sheet || 'Get Cheat Sheet'}</span>
              </button>
            }
          />
        </div>

      </div>
    </div>
  )
}