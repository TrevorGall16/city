/**
 * 🛰️ MASTER AI: CITY NAVIGATION (GOLDEN MASTER V5.6)
 * ✅ Fixed: Defined 'CityNavigationProps' to satisfy TypeScript build.
 * ✅ Premium UI: Maintained your pill-shaped button design.
 * ✅ Localized: Using dict and lang for navigation.
 */

'use client'

import Link from 'next/link'

// 🎯 ADD THIS INTERFACE - This fixes the Netlify build error
interface CityNavigationProps {
  lang: string
  dict: any
}

export function CityNavigation({ lang, dict }: CityNavigationProps) {
  const NAV_LINKS = [
    { label: dict.overview, href: '#at-a-glance' },
    { label: dict.weather, href: '#weather' },
    { label: dict.neighborhoods, href: '#neighborhoods' },
    { label: dict.culture, href: '#culture' },
    { label: dict.must_see, href: '#must-see' },
    { label: dict.must_eat, href: '#food' },
    { label: dict.logistics, href: '#logistics' },
  ]

  return (
    <nav className="sticky top-16 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
        <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          
          <Link 
            href={`/${lang}`} 
            className="text-xs font-bold uppercase text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            <span className="text-base">←</span> {dict.home}
          </Link>

          <div className="flex gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-1.5 rounded-full text-sm font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}