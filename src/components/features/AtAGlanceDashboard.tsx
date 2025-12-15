/**
 * At a Glance Dashboard
 * Quick stats section displayed in hero area
 */

import { Calendar, DollarSign, Globe, FileText } from 'lucide-react'
import type { City } from '@/types' // Import City type
import { CheatSheetWidget } from './CheatSheetWidget' // Import the widget

interface AtAGlanceDashboardProps {
  city: City // ✅ Pass the full city object instead of individual strings
}

interface AtAGlanceDashboardProps {
  bestTimeToVisit: string
  currency: string
  language: string
  vibe: string
}

export function AtAGlanceDashboard({ city }: AtAGlanceDashboardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left Side: Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 flex-1 w-full">
          {/* Time to Visit */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Best Time</p>
              {/* Logic to find 'Best' weather from your data could go here, for now using a placeholder logic or passing it in */}
              <p className="font-semibold text-slate-900 dark:text-white">Spring/Fall</p> 
            </div>
          </div>

          {/* Currency */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Currency</p>
              <p className="font-semibold text-slate-900 dark:text-white">{city.stats.currency}</p>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wide">Language</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {city.country === "Japan" ? "Japanese" : city.country === "France" ? "French" : city.country === "Italy" ? "Italian" : "English"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Cheat Sheet Button */}
        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
          <CheatSheetWidget 
            city={city} 
            trigger={
              <button className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md">
                <FileText className="w-4 h-4" />
                <span>Get Cheat Sheet</span>
              </button>
            }
          />
        </div>

      </div>
    </div>
  )
}
