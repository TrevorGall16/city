'use client'

import { SURVIVAL_DATA } from '@/data/survival_data'
import {
  Phone,
  CurrencyDollar,
  Plug,
  Drop,
  Car,
  HandCoins,
  ArrowSquareOut,
} from '@phosphor-icons/react'

interface SurvivalKitProps {
  citySlug: string
}

const items_meta = [
  { key: 'emergency',  icon: Phone,           label: 'Emergency',  color: 'text-rose-500',    bg: 'bg-rose-500/8 dark:bg-rose-500/12',    border: 'border-rose-500/15' },
  { key: 'currency',   icon: CurrencyDollar,  label: 'Currency',   color: 'text-emerald-500', bg: 'bg-emerald-500/8 dark:bg-emerald-500/12', border: 'border-emerald-500/15' },
  { key: 'plug',       icon: Plug,            label: 'Plug Type',  color: 'text-amber-500',   bg: 'bg-amber-500/8 dark:bg-amber-500/12',   border: 'border-amber-500/15' },
  { key: 'water',      icon: Drop,            label: 'Tap Water',  color: '',                 bg: '',                                       border: '' },
  { key: 'taxi',       icon: Car,             label: 'Taxi App',   color: 'text-sky-500',     bg: 'bg-sky-500/8 dark:bg-sky-500/12',       border: 'border-sky-500/15' },
  { key: 'tipping',    icon: HandCoins,       label: 'Tipping',    color: 'text-orange-500',  bg: 'bg-orange-500/8 dark:bg-orange-500/12', border: 'border-orange-500/15' },
]

export function SurvivalKit({ citySlug }: SurvivalKitProps) {
  const data = SURVIVAL_DATA[citySlug]
  if (!data) return null

  const isSafe = data.waterSafety === 'Safe'
  const waterColor = isSafe ? 'text-sky-500' : 'text-rose-500'
  const waterBg    = isSafe ? 'bg-sky-500/8 dark:bg-sky-500/12'   : 'bg-rose-500/8 dark:bg-rose-500/12'
  const waterBorder= isSafe ? 'border-sky-500/15'                  : 'border-rose-500/15'

  const cells = [
    { ...items_meta[0], value: data.emergencyNumber, href: undefined },
    { ...items_meta[1], value: data.currency,         href: undefined },
    { ...items_meta[2], value: data.plugType,         href: undefined },
    {
      ...items_meta[3],
      value: data.waterSafety,
      href: undefined,
      color: waterColor,
      bg: waterBg,
      border: waterBorder,
    },
    { ...items_meta[4], value: data.taxiApp.name,    href: data.taxiApp.url },
    { ...items_meta[5], value: data.tipping,         href: undefined },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {cells.map((cell) => {
        const Icon = cell.icon
        const inner = (
          <div
            className={`
              flex flex-col gap-3 p-5 rounded-[1.25rem]
              ${cell.bg} border ${cell.border}
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
              hover:brightness-[0.97] dark:hover:brightness-110
              active:scale-[0.98]
              ${cell.href ? 'cursor-pointer' : ''}
            `}
          >
            <div className="flex items-center justify-between">
              <Icon size={18} weight="light" className={cell.color} />
              {cell.href && (
                <ArrowSquareOut size={13} weight="light" className="text-slate-400 dark:text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1">
                {cell.label}
              </p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {cell.value}
              </p>
            </div>
          </div>
        )

        if (cell.href) {
          return (
            <a
              key={cell.label}
              href={cell.href}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              {inner}
            </a>
          )
        }

        return <div key={cell.label}>{inner}</div>
      })}
    </div>
  )
}
