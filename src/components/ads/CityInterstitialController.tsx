'use client'

import { useEffect } from 'react'
import { useCityInterstitial } from './useCityInterstitial'

interface CityInterstitialControllerProps {
  citySlug: string
}

export function CityInterstitialController({
  citySlug,
}: CityInterstitialControllerProps): null {
  const { hasShown, markShown } = useCityInterstitial(citySlug)

  useEffect(() => {
    const directLink = process.env.NEXT_PUBLIC_ADSTERRA_DIRECT_LINK
    if (!directLink) return

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href') || ''
      if (!href.startsWith('/') && !href.startsWith(window.location.origin)) return
      if (!href.includes(`/city/${citySlug}`)) return

      if (hasShown()) return

      markShown()
      window.open(directLink, '_blank', 'noopener,noreferrer')
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [citySlug, hasShown, markShown])

  return null
}
