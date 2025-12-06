/**
 * CityNavigation Component
 * Quick links navigation for long city pages
 * Provides jump-to-section functionality for better UX
 */

'use client'

import Link from 'next/link'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Weather', href: '#weather' },
  { label: 'Neighborhoods', href: '#neighborhoods' },
  { label: 'Culture', href: '#culture' },
  { label: 'Must See', href: '#sights' },
  { label: 'Must Eat', href: '#food' },
  { label: 'Logistics', href: '#logistics' },
]

export function CityNavigation() {
  return (
    <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3">
        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block px-4 py-2 rounded-full text-sm font-medium text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop: Centered flex */}
        <div className="hidden md:flex items-center justify-center gap-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-5 py-2 rounded-full text-sm font-medium text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
