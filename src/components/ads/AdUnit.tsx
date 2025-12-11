'use client'

/**
 * AdUnit Component - Reusable Ad Placeholder
 * Development: Shows gray box with size label
 * Production: Will load actual AdSense units
 *
 * Prevents layout shift by reserving space with min-height
 */

interface AdUnitProps {
  size: 'horizontal' | 'square' | 'skyscraper'
  className?: string
}

const AD_UNIT_CONFIG = {
  horizontal: {
    label: 'Horizontal Banner (728x90 / 970x90)',
    minHeight: 'min-h-[90px] md:min-h-[90px]',
    aspectRatio: 'aspect-[728/90]',
  },
  square: {
    label: 'Square (300x250)',
    minHeight: 'min-h-[250px]',
    aspectRatio: 'aspect-square',
  },
  skyscraper: {
    label: 'Vertical Skyscraper (160x600)',
    minHeight: 'min-h-[600px]',
    aspectRatio: 'aspect-[160/600]',
  },
} as const

export function AdUnit({ size, className = '' }: AdUnitProps) {
  const config = AD_UNIT_CONFIG[size]

  // Development placeholder
  const isDevelopment = process.env.NODE_ENV === 'development'

  if (isDevelopment) {
    return (
      <div
        className={`${config.minHeight} bg-slate-200 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center ${className}`}
        role="presentation"
        aria-label="Advertisement placeholder"
      >
        <div className="text-center px-4">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Ad Space
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {config.label}
          </div>
        </div>
      </div>
    )
  }

  // Production: Reserve space for actual ad
  return (
    <div
      className={`${config.minHeight} bg-slate-50 dark:bg-slate-900 rounded-lg ${className}`}
      data-ad-unit={size}
    >
      {/* AdSense script will inject here in production */}
      <div className="text-center text-xs text-slate-400 dark:text-slate-500 py-2">
        Advertisement
      </div>
    </div>
  )
}
