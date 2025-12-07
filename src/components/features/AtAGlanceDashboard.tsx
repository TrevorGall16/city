/**
 * At a Glance Dashboard
 * Quick stats section displayed in hero area
 */

import { Calendar, DollarSign, Globe, Heart } from 'lucide-react'

interface AtAGlanceDashboardProps {
  bestTimeToVisit: string
  currency: string
  language: string
  vibe: string
}

export function AtAGlanceDashboard({
  bestTimeToVisit,
  currency,
  language,
  vibe,
}: AtAGlanceDashboardProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Best Time',
      value: bestTimeToVisit,
    },
    {
      icon: DollarSign,
      label: 'Currency',
      value: currency,
    },
    {
      icon: Globe,
      label: 'Language',
      value: language,
    },
    {
      icon: Heart,
      label: 'Vibe',
      value: vibe,
    },
  ]

  return (
    <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 text-center">
        At a Glance
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-2">
                <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                {stat.label}
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                {stat.value}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
