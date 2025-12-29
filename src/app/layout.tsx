/**
 * Root Layout - Performance Optimized
 * Only loads Inter globally. City fonts loaded per-route.
 */

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { HeaderAuth } from '@/components/ui/HeaderAuth'
import { Footer } from '@/components/ui/Footer'
import { Toaster } from 'sonner'
import './globals.css'
import type { Metadata } from 'next'
import { CookieConsent } from '@/components/features/CookieConsent'
import Script from 'next/script'

// Global font only
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans', 
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL('https://citybasic.com'), 
  
  title: {
    default: 'CityBasic | Essential Travel Cheat Sheets',
    template: '%s | CityBasic',
  },
  description: 'Curated travel recommendations with instant translation for international travelers. Navigate foreign cities without language barriers.',
  
  alternates: {
    canonical: '/',
  },

  verification: {
    google: 'rFFpomnX_REM4YyHzqaM9x5fP3fygbI2clEJ31zFtpA',
  },


  icons: {
    icon: [
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'CityBasic',
    statusBarStyle: 'default',
    capable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
              <Toaster position="top-center" richColors />
              <header className="h-16 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-full flex items-center justify-between">
                  <Link href="/" className="flex items-center">
                    <div className="text-xl font-bold text-indigo-600">CityBasic</div>
                  </Link>
                  <div className="flex items-center gap-4">
                    <HeaderAuth />
                    <button className="md:hidden p-2">
                      <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                    </button>
                  </div>
                </div>
              </header>
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              <Footer />

          </AuthProvider>
        </ThemeProvider>
        <CookieConsent />
      </body>
    </html>
  )
}