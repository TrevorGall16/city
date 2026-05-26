'use client'

import React from 'react'
import AdsterraSmartFrame from './AdsterraSmartFrame'

interface AdsterraSidebarBannerProps {
  pKey: string
}

export function AdsterraSidebarBanner({
  pKey,
}: AdsterraSidebarBannerProps): React.ReactElement {
  return (
    <div
      className="w-[300px] overflow-hidden rounded-xl"
      style={{ minHeight: 600 }}
      aria-hidden="true"
    >
      <AdsterraSmartFrame
        height={600}
        width={300}
        pKey={pKey}
      />
    </div>
  )
}
