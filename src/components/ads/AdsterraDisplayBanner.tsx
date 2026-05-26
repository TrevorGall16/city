'use client'

import React from 'react'
import AdsterraBanner from './AdsterraBanner'

type DisplaySize = 'leaderboard' | 'medium-rectangle' | 'half-page' | 'billboard'

interface AdsterraDisplayBannerProps {
  size: DisplaySize
  pKey: string
  className?: string
}

const SIZE_MAP: Record<DisplaySize, { width: number; height: number }> = {
  leaderboard: { width: 728, height: 90 },
  'medium-rectangle': { width: 300, height: 250 },
  'half-page': { width: 300, height: 600 },
  billboard: { width: 970, height: 250 },
}

export function AdsterraDisplayBanner({
  size,
  pKey,
  className = '',
}: AdsterraDisplayBannerProps): React.ReactElement {
  const { width, height } = SIZE_MAP[size]

  return (
    <div
      className={`flex justify-center items-center overflow-hidden ${className}`}
      style={{ minHeight: height }}
      aria-hidden="true"
    >
      <AdsterraBanner width={width} height={height} pKey={pKey} />
    </div>
  )
}
