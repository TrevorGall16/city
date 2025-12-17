'use client'

import { useState } from 'react'
import * as Icons from 'lucide-react'
import { X } from 'lucide-react'
import type { LogisticsTopic } from '@/types'

export function LogisticsSection({ topics }: { topics: LogisticsTopic[] }) {
  const [activeTopic, setActiveTopic] = useState<LogisticsTopic | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {topics.map((topic) => {
          const IconComponent = (Icons[topic.icon as keyof typeof Icons] as any) || Icons.Info
          
          return (
            <div key={topic.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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
                      <span className="text-indigo-500 font-bold">•</span>
                      <span className="line-clamp-2">
                        {detail.includes(':') ? detail.split(':')[1] : detail}
                      </span>
                    </div>
                  ))}
                </div>

                {/* The 'Read More' Button */}
                <button 
                  onClick={() => setActiveTopic(topic)}
                  className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-widest"
                >
                  Read Full Guide →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* The Full Screen Popup (Modal) */}
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