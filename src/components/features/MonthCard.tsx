/**
 * MonthCard Component
 * Displays weather details for a specific month
 */

import { Check, X } from 'lucide-react'

interface MonthCardProps {
  month: {
    id: number
    name: string
    temp: string
    vibe: string
    pros: string[]
    cons: string[]
    clothing: string
  }
}

export function MonthCard({ month }: MonthCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out min-w-[280px]">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">{month.name}</h3>
        <div className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{month.temp}</div>
        <div className="text-sm text-slate-600 dark:text-slate-400 italic mt-1">{month.vibe}</div>
      </div>

      {/* Pros */}
      {month.pros.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
            Pros
          </div>
          <ul className="space-y-1">
            {month.pros.map((pro, index) => (
              <li key={index} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-green-600 dark:text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cons */}
      {month.cons.length > 0 && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-red-700 dark:text-red-400 uppercase tracking-wide mb-2">
            Cons
          </div>
          <ul className="space-y-1">
            {month.cons.map((con, index) => (
              <li key={index} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                <X className="w-4 h-4 text-red-600 dark:text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clothing */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1">
          Pack
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">{month.clothing}</div>
      </div>
    </div>
  )
}
