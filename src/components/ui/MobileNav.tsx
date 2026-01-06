'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { X, Home, Info, Mail, Shield, BookOpen } from 'lucide-react'
import { LanguageSelector } from './LanguageSelector'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  lang: string
  dict: any // 🎯 Added for translations
}

export function MobileNav({ isOpen, onClose, lang, dict }: MobileNavProps) {
  // Trap focus & Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden' // Prevent scrolling background
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Panel */}
      <nav
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-[100] transform transition-transform duration-300 ease-out border-l border-slate-200 dark:border-slate-800 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Navigation Links */}
          <ul className="space-y-2">
            <li>
              <Link 
                href={`/${lang}`} 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                {dict.home || 'Home'}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${lang}/about`} 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <Info className="w-5 h-5" aria-hidden="true" />
                {dict.about || 'About'}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${lang}/how-to-use`} 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                {dict.how_to_use || 'How to Use'}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${lang}/contact`} 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                <Mail className="w-5 h-5" aria-hidden="true" />
                {dict.contact || 'Contact'}
              </Link>
            </li>
          </ul>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Language Selector in Mobile */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              Language
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
              <LanguageSelector />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-slate-950">
          <Link 
            href={`/${lang}/privacy`} 
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-indigo-500 flex items-center justify-center gap-2"
          >
            <Shield className="w-3 h-3" /> Privacy Policy
          </Link>
        </div>
      </nav>
    </>
  )
}