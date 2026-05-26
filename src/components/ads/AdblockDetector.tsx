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
      className="fixed inset-0 bg-zinc-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Ad blocker notice"
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            One small ask
          </h2>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="
              shrink-0 w-7 h-7 rounded-full
              flex items-center justify-center
              text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800
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

        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
          Please, if you could disable your ad blocker it would really help me as a
          solo developer. I&apos;m not going to block you from using the website
          even with ads, but if you could disable it, that would be cool from your
          part. Thank you!
        </p>

        <button
          onClick={() => setDismissed(true)}
          className="
            mt-6 w-full px-4 py-2.5 rounded-xl
            bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white
            text-white dark:text-zinc-900
            text-sm font-bold
            transition-all duration-200
            active:scale-[0.98]
          "
        >
          Got it, I&apos;ll consider it
        </button>
      </div>
    </div>
  )
}
