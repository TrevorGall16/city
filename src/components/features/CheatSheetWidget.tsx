'use client'

import { useState } from 'react'
import { FileText, X, AlertTriangle, Utensils, Info, Shield, Download } from 'lucide-react'
import type { City } from '@/types'

interface CheatSheetWidgetProps {
  city: City
  trigger?: React.ReactNode // Allow custom button trigger
}

export function CheatSheetWidget({ city, trigger }: CheatSheetWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  // ✅ IMPROVED LOGIC: Search Titles AND Slugs to find data
  const findLogistics = (keywords: string[]) => {
    return city.logistics.find(l => 
      keywords.some(k => l.slug.toLowerCase().includes(k) || l.title.toLowerCase().includes(k))
    )
  }

  // 1. Find Scams (Look for 'scam' OR 'safety' if specific scams aren't found)
  const scamSection = findLogistics(['scam', 'trap']) || findLogistics(['safety'])
  const scams = scamSection?.details.slice(0, 3) || ["Keep your wits about you."]

  // 2. Find Safety (Fallback to general tips)
  const safetySection = findLogistics(['safety', 'survival', 'emergency'])
  const safety = safetySection?.details[0] || "Call emergency services if needed."

  const foods = city.must_eat.slice(0, 3)
  const tips = city.culture.etiquette_tips.slice(0, 3)

  return (
    <>
      {/* Trigger: Use the custom button passed in, or default to a text link */}
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <button className="flex items-center gap-2 text-indigo-600 font-bold hover:underline">
            <FileText className="w-4 h-4" />
            View Cheat Sheet
          </button>
        )}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Close on click outside */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold font-serif">{city.name} Cheat Sheet</h2>
                <p className="text-indigo-100 text-sm mt-1">Screenshot this 📸</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Scams */}
              <div>
                <h3 className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-xs mb-3">
                  <AlertTriangle className="w-4 h-4" /> Watch Out For
                </h3>
                <ul className="space-y-2">
                  {scams.map((scam, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 leading-snug bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-100 dark:border-rose-900">
                      {scam.split(':')[0]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Foods */}
              <div>
                <h3 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-xs mb-3">
                  <Utensils className="w-4 h-4" /> Eat Priority #1
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {foods.map((food) => (
                    <div key={food.id} className="flex items-center justify-between text-sm p-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{food.name_en}</span>
                      <span className="text-xs text-slate-500">{food.name_local}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Etiquette */}
              <div>
                <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-xs mb-3">
                  <Info className="w-4 h-4" /> Local Rules
                </h3>
                <ul className="list-disc list-outside pl-4 text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  {tips.map((tip, i) => (
                    <li key={i}>{tip.split(':')[0]}</li>
                  ))}
                </ul>
              </div>

              {/* Safety */}
              <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-slate-500 mt-0.5" />
                <div>
                  <span className="text-xs font-bold uppercase text-slate-500">Logistics Check</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-tight mt-1">{safety.split(':')[0]}</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">CitySheet.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}