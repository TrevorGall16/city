'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Globe } from 'lucide-react'
import { LanguageSelector } from './LanguageSelector'
import { HeaderAuth } from './HeaderAuth'
import { MobileNav } from './MobileNav'

interface HeaderProps {
  lang: string
  dict: any
}

export function Header({ lang, dict }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="h-20 border-b border-slate-100 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-[50]">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link 
            href={`/${lang}`} 
            className="group flex items-center gap-2"
            aria-label="CityBasic Home"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform duration-500" aria-hidden="true">
              <Globe className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
              CityBasic
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            <HeaderAuth />

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-slate-100 dark:bg-slate-900 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>
          
        </div>
      </header>

      <MobileNav 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        lang={lang} 
        dict={dict || {}} 
      />
    </>
  )
}