'use client'

/**
 * AdProvider - Context for Ad Management
 * Following 04_Ads_SEO specification
 *
 * Features:
 * - Listen to route changes (usePathname)
 * - Throttle ad refreshes to 30 seconds
 * - Check for consent (mocked as true for V1)
 */

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

interface AdContextType {
  hasConsent: boolean
  refreshAds: () => void
}

const AdContext = createContext<AdContextType>({
  hasConsent: true,
  refreshAds: () => {},
})

export function AdProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [hasConsent, setHasConsent] = useState(true) // Mocked as true for V1
  const lastRefreshRef = useRef<number>(0)

  useEffect(() => {
    // On route change, refresh ads (throttled)
    refreshAds()
  }, [pathname])

  const refreshAds = () => {
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshRef.current

    // Throttle: max 1 refresh per 30 seconds
    if (timeSinceLastRefresh < 30000) {
      console.log(`⏳ Ad refresh throttled (${Math.round((30000 - timeSinceLastRefresh) / 1000)}s remaining)`)
      return
    }

    lastRefreshRef.current = now

    // In production, this would trigger actual ad refresh
    // For now, just log
    console.log('🔄 Ads refreshed on route change:', pathname)

    // Example: If using Google AdSense
    // if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    //   try {
    //     (window.adsbygoogle = window.adsbygoogle || []).push({})
    //   } catch (e) {
    //     console.error('Ad refresh error:', e)
    //   }
    // }
  }

  return (
    <AdContext.Provider value={{ hasConsent, refreshAds }}>
      {children}
    </AdContext.Provider>
  )
}

export const useAds = () => {
  const context = useContext(AdContext)
  if (!context) {
    throw new Error('useAds must be used within AdProvider')
  }
  return context
}
