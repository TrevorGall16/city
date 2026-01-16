/**
 * 🛰️ MASTER AI: ROOT LAYOUT GOLDEN MASTER (V6.1)
 * ✅ Fixed: Removed extra </div> causing syntax error.
 * ✅ Fixed: Corrected HeaderAuth import path.
 */

import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'
import { Toaster } from 'sonner'
import '@/app/globals.css'
import type { Metadata } from 'next'
import { CookieConsent } from '@/components/features/CookieConsent'
import { getDict } from '@/data/dictionaries' // 🎯 REQUIRED IMPORT

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

  // 👇 PASTE THIS SECTION HERE 👇
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  // 👆 END OF NEW SECTION 👆
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

// 🎯 FIX: Fetch dictionary for the Header
  const dict = await getDict(displayLang)

  return (
    <html lang={displayLang} suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100`}>
        {/* Skip Link for Accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-indigo-600 focus:text-white focus:font-bold focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300"
        >
          Skip to main content
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Toaster position="top-center" richColors />
            
            {/* 🎯 FIX: Passed 'dict' to Header */}
            <Header lang={displayLang} dict={dict} />

            <main id="main-content" className="min-h-screen">
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