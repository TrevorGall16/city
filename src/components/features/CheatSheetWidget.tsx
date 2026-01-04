/**
 * 🛰️ MASTER AI: CHEAT SHEET MODAL (V6.0 - CRASH PROOF)
 * ✅ Stability: Added Array.isArray guards to all slice operations.
 * ✅ Feature: Kept the "Screenshot-Friendly" premium modal design.
 * ✅ Strategy: Defensive mapping to handle missing translation keys.
 */

'use client'

import { useState } from 'react'
import { FileText, X, AlertTriangle, Utensils, Info } from 'lucide-react'
import type { City } from '@/types'

interface CheatSheetWidgetProps {
  city: City
  trigger?: React.ReactNode 
  dict: any 
}

export function CheatSheetWidget({ city, trigger, dict }: CheatSheetWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const d = dict || {}; 

  // ✅ 1. SAFE LOGISTICS SEARCH
  const findLogistics = (keywords: string[]) => {
    const logArray = Array.isArray(city.logistics) ? city.logistics : []
    return logArray.find(l =>
      keywords.some(k => l.slug?.toLowerCase().includes(k) || l.title?.toLowerCase().includes(k))
    )
  }

  // ✅ 2. DEFENSIVE DATA EXTRACTION (Fixes the .slice errors)
  const scamSection = findLogistics(['scam', 'trap']) || findLogistics(['safety'])
  const scams = Array.isArray(scamSection?.details) 
    ? scamSection.details.slice(0, 3) 
    : [d.safety_tip_fallback || "Keep your wits about you."]

  const foods = Array.isArray(city.must_eat) 
    ? city.must_eat.slice(0, 3) 
    : []

  const tips = Array.isArray(city.culture?.etiquette_tips) 
    ? city.culture.etiquette_tips.slice(0, 3) 
    : []

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer">
        {trigger || (
          <button className="flex items-center gap-2 text-indigo-600 font-bold hover:underline transition-all">
            <FileText className="w-4 h-4" />
            {d.get_cheat_sheet || 'View Cheat Sheet'}
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            
            {/* Header: Brand Identity (Screenshot Ready) */}
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
                  {city.name} <br/> 
                  <span className="text-indigo-200 text-xl">{d.cheat_sheet_title || 'Cheat Sheet'}</span>
                </h2>
                <p className="text-indigo-100/80 text-xs font-bold uppercase tracking-widest mt-4">
                  {d.screenshot_tip || 'Screenshot this 📸'}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-white/20 hover:bg-rose-500 hover:text-white p-3 rounded-2xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area: Priority Travel Tips */}
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
              
              {/* Watch Out For (Scams) */}
              <div>
                <h3 className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-[10px] mb-4">
                  <AlertTriangle className="w-4 h-4" /> {d.watch_out_title || 'Watch Out For'}
                </h3>
                <ul className="space-y-3">
                  {scams.map((scam: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-rose-100/50 dark:border-rose-900/30">
                      {scam.split(':')[0]}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eat Priority #1 */}
              <div>
                <h3 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-4">
                  <Utensils className="w-4 h-4" /> {d.eat_priority_title || 'Eat Priority #1'}
                </h3>
                <div className="space-y-2">
                  {foods.length > 0 ? foods.map((food: any, idx: number) => (
                    <div key={food.id || idx} className="flex items-center justify-between text-base p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{food.name_en}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {food.name_local !== food.name_en ? food.name_local : ''}
                      </span>
                    </div>
                  )) : (
                    <div className="p-4 text-xs text-slate-400 italic">{d.data_pending || 'Update in progress...'}</div>
                  )}
                </div>
              </div>

              {/* Local Rules (Etiquette) */}
              <div>
                <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black uppercase tracking-widest text-[10px] mb-4">
                  <Info className="w-4 h-4" /> {d.local_rules_title || 'Local Rules'}
                </h3>
                <ul className="space-y-3 pl-2">
                  {tips.length > 0 ? tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex gap-3">
                       <span className="text-amber-500 font-black">•</span>
                       {tip.split(':')[0]}
                    </li>
                  )) : (
                    <li className="p-2 text-xs text-slate-400 italic">{d.data_pending || 'Update in progress...'}</li>
                  )}
                </ul>
              </div>

            </div>

            {/* Branded Footer */}
            <div className="bg-slate-50 dark:bg-slate-950 p-6 text-center border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase italic">CityBasic.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}