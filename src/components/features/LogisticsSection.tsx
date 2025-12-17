'use client'

import { useState } from 'react'
import * as Icons from 'lucide-react'
import { X } from 'lucide-react'
import type { LogisticsTopic } from '@/types'

export function LogisticsSection({ topics }: { topics: LogisticsTopic[] }) {
  const [activeTopic, setActiveTopic] = useState<LogisticsTopic | null>(null)

  // ✅ Master Color Mapper
  const getTopicStyles = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes('getting around') || t.includes('transport')) return 'border-t-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
    if (t.includes('airport')) return 'border-t-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10'
    if (t.includes('safety') || t.includes('scams')) return 'border-t-rose-500 bg-rose-50/50 dark:bg-rose-900/10'
    if (t.includes('money') || t.includes('payment')) return 'border-t-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10'
    if (t.includes('health') || t.includes('pharmacy')) return 'border-t-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/10'
    if (t.includes('dining') || t.includes('protocol')) return 'border-t-orange-500 bg-orange-50/50 dark:bg-orange-900/10'
    // Culture / Museum Strategy: Pink (New)
  if (t.includes('museum') || t.includes('strategy') || t.includes('booking')) 
    return 'border-t-pink-500 bg-pink-50/50 dark:bg-pink-900/10'
    // Digital / Apps: Purple (New)
  if (t.includes('app') || t.includes('download') || t.includes('sim card')) 
    return 'border-t-purple-500 bg-purple-50/50 dark:bg-purple-900/10'
    return 'border-t-slate-500 bg-slate-50/50 dark:bg-slate-900/10'
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic) => {
          const IconComponent = (Icons[topic.icon as keyof typeof Icons] as any) || Icons.Info
          const colorStyles = getTopicStyles(topic.title) // ✅ Get the styles
          
          return (
            <div 
              key={topic.id} 
              // ✅ Apply colorStyles and border-t-4 here
              className={`flex flex-col h-full rounded-xl border border-slate-200 dark:border-slate-800 border-t-4 shadow-sm hover:shadow-md transition-all ${colorStyles}`}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100/50 dark:border-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50">{topic.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{topic.summary}</p>
                  </div>
                </div>
              </div>

              {/* Body: Shows ONLY 3 Teaser Points */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-3 mb-6">
                  {topic.details.slice(0, 3).map((detail, idx) => (
                    <div key={idx} className="text-sm flex gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-slate-400 font-bold">•</span>
                      <span className="line-clamp-2">
                        {detail.includes(':') ? detail.split(':')[1] : detail}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setActiveTopic(topic)}
                  className="w-full py-3 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all uppercase tracking-widest"
                >
                  Read Full Guide →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* The Full Screen Popup (Modal) remains same */}
      {activeTopic && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{activeTopic.title}</h2>
              <button onClick={() => setActiveTopic(null)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
               <div className="space-y-6">
                 {activeTopic.details.map((detail, idx) => {
                   const parts = detail.split(':')
                   const hasLabel = parts.length > 1
                   return (
                     <div key={idx} className="border-l-4 border-slate-200 dark:border-slate-800 pl-4 py-1">
                       {hasLabel ? (
                         <>
                           <span className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-1">{parts[0]}</span>
                           <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{parts.slice(1).join(':').trim()}</p>
                         </>
                       ) : (
                         <p className="text-slate-700 dark:text-slate-200 leading-relaxed">{detail}</p>
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