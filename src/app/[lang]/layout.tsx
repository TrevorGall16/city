/**
 * 🛰️ MASTER AI: ROOT LAYOUT GOLDEN MASTER (V6.0)
 * ✅ SEO: Full hreflang alternate mapping for all 9 languages.
 * ✅ Performance: Optimized font swapping and hydration safety.
 * ✅ Aesthetic: Silk-blur navigation with high-saturation branding.
 */

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Menu, Globe } from 'lucide-react'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { HeaderAuth } from '@/components/ui/HeaderAuth'
import { Footer } from '@/components/ui/Footer'
import { Toaster } from 'sonner'
import '../globals.css'
import type { Metadata } from 'next'
import { CookieConsent } from '@/components/features/CookieConsent'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  display: 'swap',
  preload: true,
})

const SUPPORTED_LANGS = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar']
const BASE_URL = 'https://citybasic.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'CityBasic | Travel Cheat Sheets for International Travelers',
    template: '%s | CityBasic',
  },
  description: 'Instant travel guides with local phrases and no-fluff recommendations. Navigate 60+ cities like a local.',
  
  // 🎯 CRITICAL FOR TRAFFIC: Tells Google about all language versions
  alternates: {
    canonical: '/',
    languages: Object.fromEntries(
      SUPPORTED_LANGS.map(lang => [lang, `/${lang}`])
    ),
  },

  verification: {
    google: 'rFFpomnX_REM4YyHzqaM9x5fP3fygbI2clEJ31zFtpA',
  },
  manifest: '/site.webmanifest',
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const displayLang = lang || 'en'

  return (
    <html lang={displayLang} suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            
            {/* 🌌 PREMIUM SILK NAVIGATION */}
            <header className="h-20 border-b border-slate-100 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl sticky top-0 z-[100]">
              <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                
                <Link href={`/${displayLang}`} className="group flex items-center gap-2">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    <Globe className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
                    CityBasic
                  </span>
                </Link>

                <div className="flex items-center gap-6">
                  <div className="hidden md:block">
                    <LanguageSelector />
                  </div>
                  <HeaderAuth />
                  <button className="lg:hidden p-3 bg-slate-100 dark:bg-slate-900 rounded-xl">
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </header>

            <main className="min-h-screen">
              {children}
            </main>

            <Footer />
            <CookieConsent />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}