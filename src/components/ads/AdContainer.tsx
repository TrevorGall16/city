'use client'

/**
 * AdContainer Component
 * Following 04_Ads_SEO and 06_Quality strict CLS prevention rules
 *
 * CRITICAL: Must enforce min-height to prevent layout shift
 */

import { useEffect, useRef } from 'react'
import { AD_SLOTS } from '@/lib/constants'

interface AdContainerProps {
  slot: 'header' | 'grid' | 'sidebar' | 'footer'
  className?: string
}

export function AdContainer({ slot, className = '' }: AdContainerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const config = AD_SLOTS[slot]

  useEffect(() => {
    // Ad initialization logic will go here in Phase 5
    // For now, render placeholder
  }, [slot])

  return (
    <div
      ref={adRef}
      className={`${config.minHeight} bg-slate-100 rounded-lg flex items-center justify-center ${className}`}
      data-ad-slot={config.id}
    >
      <div className="text-center text-slate-400">
        <div className="text-xs uppercase tracking-wide font-medium">
          Advertisement
        </div>
        <div className="text-xs mt-1 text-slate-300">
          {config.id}
        </div>
      </div>
    </div>
  )
}
