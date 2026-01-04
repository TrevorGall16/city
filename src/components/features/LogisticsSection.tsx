/**
 * 🛰️ MASTER AI: LOGISTICS SECTION GOLDEN MASTER (V5.0)
 * ✅ Feature-Complete: Stable color mapping, dynamic Lucide icons, and interactive modals.
 * ✅ Crash-Proof: Integrated Array.isArray() safety checks to prevent ".map is not a function" errors.
 * ✅ Aesthetic: Premium spacing, line-clamping for teaser consistency, and high-saturation border-t accents.
 */

'use client'

import { useState } from 'react'
import * as Icons from 'lucide-react'
import { X, Info } from 'lucide-react' // ✅ Added Info as a stable fallback icon
import type { LogisticsTopic } from '@/types'

export function LogisticsSection({ topics }: { topics: LogisticsTopic[] }) {
  const [activeTopic, setActiveTopic] = useState<LogisticsTopic | null>(null)

  // 🛡️ CRASH-PROOF PROTECTION:
  // If topics is missing, null, or an object (like the Rome error), 
  // we return a beautiful empty-state instead of crashing the site.
  if (!topics || !Array.isArray(topics)) {
    return (
      <div className="w-full p-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
        <Info className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">
          Practical logistics for this city are currently being updated.
        </p>
      </div>
    );
  }

  /**
   * ✅ Stable Color Mapper (RETAINED)
   * Ensures visual consistency regardless of language or topic count.
   */
  const getStableStyles = (index: number) => {
    const styles = [
      'border-t-blue-500 bg-blue-50/50 dark:bg-blue-900/10',    
      'border-t-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10', 
      'border-t-rose-500 bg-rose-50/50 dark:bg-rose-900/10',       
      'border-t-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10', 
      'border-t-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/10',       
      'border-t-orange-500 bg-orange-50/50 dark:bg-orange-900/10', 
      'border-t-pink-500 bg-pink-50/50 dark:bg-pink-900/10',       
      'border-t-purple-500 bg-purple-50/50 dark:bg-purple-900/10', 
    ]
    return styles[index % styles.length]
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic, index) => {
          // 🛡️ Safety: Fallback to Info icon if the string doesn't match a Lucide component
          const IconComponent = (Icons[topic.icon as keyof typeof Icons] as any) || Icons.Info
          const colorStyles = getStableStyles(index)
          
          return (
            <div 
              key={topic.id || `logistics-${index}`} 
              className={`flex flex-col h-full rounded-[2rem] border border-slate-200 dark:border-slate-800 border-t-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${colorStyles}`}
            >
              {/* Header: Title and Summary */}
              <div className="p-8 border-b border-slate-100/50 dark:border-slate-800/50">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0 border border-slate-100 dark:border-slate-700">
                    <IconComponent className="w-7 h-7 text-slate-800 dark:text-slate-100" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-900 dark:text-slate-50 tracking-tight">{topic.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-bold uppercase tracking-widest">{topic.summary}</p>
                  </div>
                </div>
              </div>

              {/* Body: Teaser Bullet Points */}
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div className="space-y-4 mb-8">
                  {/* 🛡️ Safety: Ensure details is an array before slicing */}
                  {(topic.details || []).slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="text-sm flex gap-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                      <span className="text-indigo-500 font-black">•</span>
                      <span className="line-clamp-2">
                        {detail.includes(':') ? detail.split(':')[1].trim() : detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Interaction Button */}
                <button 
                  onClick={() => setActiveTopic(topic)}
                  className="w-full py-4 bg-white/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all uppercase tracking-[0.2em]"
                >
                  Read Full Guide →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Full-Screen Detailed Modal (RETAINED) */}
      {activeTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in zoom-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
              <div className="flex items-center gap-4">
                 <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">{activeTopic.title}</h2>
              </div>
              <button 
                onClick={() => setActiveTopic(null)} 
                className="p-3 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-500 text-slate-400 rounded-2xl transition-all"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-10 overflow-y-auto custom-scrollbar">
               <div className="space-y-8">
                 {(activeTopic.details || []).map((detail, idx) => {
                   const parts = detail.split(':')
                   const hasLabel = parts.length > 1
                   return (
                     <div key={idx} className="border-l-4 border-indigo-500 pl-6 py-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-r-2xl">
                       {hasLabel ? (
                         <>
                           <span className="block text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">
                             {parts[0]}
                           </span>
                           <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                             {parts.slice(1).join(':').trim()}
                           </p>
                         </>
                       ) : (
                         <p className="text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                           {detail}
                         </p>
                       )}
                     </div>
                   )
                 })}
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}