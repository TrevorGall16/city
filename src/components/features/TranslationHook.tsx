'use client'

/**
 * TranslationHook Component - THE CORE FEATURE
 * Following 03_UI strict specifications
 *
 * This is the "Hook" - allows users to copy local text to clipboard
 * to show to taxi drivers or waiters.
 */

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface TranslationHookProps {
  text: string
  placeName?: string
  label?: string
  className?: string
}

export function TranslationHook({
  text,
  placeName = '',
  label = 'Local Name',
  className = ''
}: TranslationHookProps) {
  const [copied, setCopied] = useState(false)
  const { trackCopyLocal } = useAnalytics()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)

      // Track the North Star Metric
      trackCopyLocal(text, placeName)

      // Reset after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div
      className={`bg-amber-50 border border-amber-200 rounded-lg p-3 flex justify-between items-center ${className}`}
    >
      <div>
        <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">
          {label}
        </div>
        <div className="font-medium text-amber-900 text-lg">
          {text}
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="ml-4 p-2 rounded-md hover:bg-amber-100 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <Copy className="w-5 h-5 text-amber-700" />
        )}
      </button>
    </div>
  )
}
