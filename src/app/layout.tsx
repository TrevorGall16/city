/**
 * Root Layout
 * Following 03_UI section 1 (Global Layout specification)
 */

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { AdProvider } from '@/components/ads/AdProvider'
import { HeaderAuth } from '@/components/ui/HeaderAuth'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'City Sheet - Your Travel Cheat Sheet',
  description: 'Curated travel recommendations with instant translation for international travelers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <AdProvider>
            {/* Header - Sticky */}
            <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-xl font-bold text-indigo-600">
                CitySheet
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side - Auth & Mobile Menu */}
            <div className="flex items-center gap-4">
              <HeaderAuth />

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2">
                <Menu className="w-6 h-6 text-slate-700" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-slate-50 border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* About */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  City Sheet
                </h3>
                <p className="text-sm text-slate-600">
                  Your travel cheat sheet with instant translation.
                  Navigate foreign cities without language barriers.
                </p>
              </div>

              {/* Links */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Explore
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>
                    <Link href="/" className="hover:text-indigo-600">
                      All Cities
                    </Link>
                  </li>
                  <li>
                    <Link href="/city/paris" className="hover:text-indigo-600">
                      Paris
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Info
                </h3>
<p className="text-sm text-slate-600" suppressHydrationWarning>
  Built with Next.js, Tailwind CSS, and Supabase.
</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
              © {new Date().getFullYear()} City Sheet. All rights reserved.
            </div>
          </div>
        </footer>
          </AdProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
