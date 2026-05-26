'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useCityInterstitial } from './useCityInterstitial'

type DisplaySize = 'leaderboard' | 'medium-rectangle' | 'skyscraper' | 'half-skyscraper'

const SIZE_DIMENSIONS: Record<DisplaySize, { width: number; height: number }> = {
  'leaderboard': { width: 728, height: 90 },
  'medium-rectangle': { width: 300, height: 250 },
  'skyscraper': { width: 160, height: 600 },
  'half-skyscraper': { width: 160, height: 300 },
}

const SIZE_ENV_KEYS: Record<DisplaySize, string | undefined> = {
  'leaderboard': process.env.NEXT_PUBLIC_ADSTERRA_KEY_LEADERBOARD,
  'medium-rectangle': process.env.NEXT_PUBLIC_ADSTERRA_KEY_RECTANGLE,
  'skyscraper': process.env.NEXT_PUBLIC_ADSTERRA_KEY_SKYSCRAPER_600,
  'half-skyscraper': process.env.NEXT_PUBLIC_ADSTERRA_KEY_SKYSCRAPER_300,
}

interface AdsterraDisplayProps {
  size: DisplaySize
}

export function AdsterraDisplay({ size }: AdsterraDisplayProps): React.ReactElement | null {
  const { width, height } = SIZE_DIMENSIONS[size]
  const pKey = SIZE_ENV_KEYS[size]
  const containerRef = useRef<HTMLDivElement>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || isLoaded.current || !pKey) return

    const iframe = document.createElement('iframe')
    iframe.style.border = '0'
    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
    iframe.style.overflow = 'hidden'
    iframe.scrolling = 'no'

    const htmlContent = `
      <html>
        <head>
          <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }</style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '${pKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="//plentyhelium.com/${pKey}/invoke.js"></script>
        </body>
      </html>
    `

    container.appendChild(iframe)
    const doc = iframe.contentWindow?.document || iframe.contentDocument
    if (doc) {
      doc.open()
      doc.write(htmlContent)
      doc.close()
      isLoaded.current = true
    }

    return () => {
      if (container) container.innerHTML = ''
      isLoaded.current = false
    }
  }, [width, height, pKey])

  if (!pKey) return null

  return (
    <div
      ref={containerRef}
      style={{ minWidth: width, minHeight: height, width, height }}
      aria-hidden="true"
    />
  )
}

interface AdsterraPopunderProps {
  citySlug: string
}

export function AdsterraPopunder({ citySlug }: AdsterraPopunderProps): null {
  const { hasShown, markShown } = useCityInterstitial(citySlug)

  useEffect(() => {
    const popunderSrc = process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_SRC
    if (!popunderSrc) return
    if (hasShown()) return

    const script = document.createElement('script')
    script.src = popunderSrc
    script.async = true
    document.head.appendChild(script)

    const handleClick = () => {
      if (hasShown()) return
      markShown()
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [citySlug, hasShown, markShown])

  return null
}

export function AdblockModal(): React.ReactElement | null {
  const [detected, setDetected] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_FORCE_ADBLOCK === 'true') {
      setDetected(true)
      return
    }

    const bait = document.createElement('div')
    bait.className = 'pub-banner ad-zone adsbox'
    bait.style.cssText = 'position:absolute;top:-9999px;left:-9999px;width:1px;height:1px;'
    document.body.appendChild(bait)

    const timer = setTimeout(() => {
      const style = window.getComputedStyle(bait)
      const hidden =
        bait.offsetHeight === 0 ||
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.opacity === '0'

      if (hidden) setDetected(true)
      if (document.body.contains(bait)) document.body.removeChild(bait)
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
      <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close"
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors duration-150 active:scale-[0.95]"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
          className="mt-6 w-full px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-medium text-sm transition-colors duration-150"
        >
          Got it, I&apos;ll consider it
        </button>
      </div>
    </div>
  )
}
