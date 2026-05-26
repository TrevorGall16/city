'use client'

import React, { useEffect, useState } from 'react'

export function AdblockDetector(): React.ReactElement | null {
  const [detected, setDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const bait = document.createElement('div')
    bait.className = 'pub-banner ad-zone adsbox'
    bait.style.cssText =
      'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(bait)

    const timer = setTimeout(() => {
      const style = window.getComputedStyle(bait)
      const hidden =
        bait.offsetHeight === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'

      if (hidden) setDetected(true)
      document.body.removeChild(bait)
    }, 300)

    return () => {
      clearTimeout(timer)
      if (document.body.contains(bait)) document.body.removeChild(bait)
    }
  }, [])

  if (!detected || dismissed) return null

  return (
    <div
      role="status"
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-amber-50 border-t border-amber-200
        px-4 py-3 md:py-4
        flex items-start md:items-center justify-between gap-3
        shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.08)]
      "
    >
      <p className="text-sm text-amber-900 font-medium leading-snug max-w-prose">
        S&apos;il vous plaît, désactivez votre bloqueur de publicité. Je ne veux
        pas vous bloquer l&apos;accès au site, mais si vous pouvez le faire, ce
        serait vraiment sympa de soutenir mon travail&nbsp;!
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Fermer"
        className="
          shrink-0 w-7 h-7 rounded-full
          flex items-center justify-center
          text-amber-700 hover:bg-amber-100
          transition-colors duration-150
          active:scale-[0.95]
        "
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
