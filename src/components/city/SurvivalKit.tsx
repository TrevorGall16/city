'use client'

import { SURVIVAL_DATA } from '@/data/survival_data'
import {
  Phone,
  Banknote,
  Plug,
  Droplets,
  Car,
  HandCoins,
} from 'lucide-react'

interface SurvivalKitProps {
  citySlug: string
}

export function SurvivalKit({ citySlug }: SurvivalKitProps) {
  const data = SURVIVAL_DATA[citySlug]
  if (!data) return null

  const items = [
    {
      icon: Phone,
      label: 'Emergency',
      value: data.emergencyNumber,
      color: 'text-red-500',
      bg: 'bg-red-500/10 dark:bg-red-500/20',
    },
    {
      icon: Banknote,
      label: 'Currency',
      value: data.currency,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    },
    {
      icon: Plug,
      label: 'Plug Type',
      value: data.plugType,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    },
    {
      icon: Droplets,
      label: 'Tap Water',
      value: data.waterSafety,
      color: data.waterSafety === 'Safe' ? 'text-sky-500' : 'text-rose-500',
      bg: data.waterSafety === 'Safe'
        ? 'bg-sky-500/10 dark:bg-sky-500/20'
        : 'bg-rose-500/10 dark:bg-rose-500/20',
    },
    {
      icon: Car,
      label: 'Taxi App',
      value: data.taxiApp.name,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 dark:bg-violet-500/20',
      href: data.taxiApp.url,
    },
    {
      icon: HandCoins,
      label: 'Tipping',
      value: data.tipping,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10 dark:bg-orange-500/20',
    },
  ]

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 py-10">
      <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">
        Survival Kit
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const content = (
            <div
              key={item.label}
              className={`${item.bg} rounded-2xl p-5 border border-white/50 dark:border-white/10 shadow-sm flex flex-col items-center text-center gap-3 transition-transform hover:scale-[1.03]`}
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {item.label}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {item.value}
              </p>
            </div>
          )

          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                {content}
              </a>
            )
          }

          return <div key={item.label}>{content}</div>
        })}
      </div>
    </section>
  )
}
