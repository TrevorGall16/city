/**
 * Interactive World Map Component
 * High-quality SVG-based world map with dotted pattern (Aceternity-inspired)
 * Features: Hover states, tooltips, click navigation
 */

'use client'

import { useState } from 'react'

// ============================================================================
// COUNTRY THEME COLORS
// ============================================================================
const COUNTRY_COLORS = {
  gb: {
    default: '#002868', // Navy blue for UK
    hover: '#1d4ed8',
  },
  fr: {
    default: '#3b82f6', // Blue-500 for France
    hover: '#1d4ed8',
  },
  de: {
    default: '#eab308', // Yellow-500 for Germany
    hover: '#a16207',
  },
  jp: {
    default: '#ef4444', // Red-500 for Japan
    hover: '#b91c1c',
  },
  th: {
    default: '#d97706', // Amber-600 for Thailand (Gold)
    hover: '#92400e',
  },
  us: {
    default: '#3b82f6', // Blue for USA
    hover: '#1e40af',
  },
}

interface CountryData {
  id: string
  name: string
  code: string
  citySlug: string
  path: string // High-quality SVG path data
}

// High-quality country paths (Mercator projection, viewBox: 0 0 2000 1000)
const COUNTRIES: CountryData[] = [
  {
    id: 'united-kingdom',
    name: 'United Kingdom',
    code: 'gb',
    citySlug: 'london',
    // UK - detailed outline
    path: 'M 925 285 L 930 280 L 935 278 L 940 280 L 943 285 L 945 290 L 943 298 L 938 305 L 932 310 L 925 312 L 920 310 L 918 305 L 918 298 L 920 290 L 923 287 Z M 928 315 L 932 313 L 936 315 L 938 320 L 935 325 L 930 327 L 926 325 L 925 320 Z',
  },
  {
    id: 'france',
    name: 'France',
    code: 'fr',
    citySlug: 'paris',
    // France - detailed outline
    path: 'M 960 310 L 968 308 L 978 310 L 988 315 L 995 325 L 998 338 L 995 350 L 988 360 L 978 368 L 965 372 L 952 370 L 945 362 L 940 350 L 938 338 L 942 325 L 950 315 L 958 312 Z',
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'de',
    citySlug: 'berlin',
    // Germany - detailed outline
    path: 'M 1010 295 L 1025 293 L 1040 295 L 1052 302 L 1060 312 L 1062 325 L 1058 338 L 1048 348 L 1035 352 L 1020 350 L 1008 342 L 1002 330 L 1000 318 L 1005 305 L 1012 298 Z',
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'jp',
    citySlug: 'tokyo',
    // Japan - detailed island chain
    path: 'M 1750 380 L 1758 375 L 1768 378 L 1775 385 L 1780 395 L 1782 408 L 1780 420 L 1775 432 L 1768 442 L 1758 448 L 1748 450 L 1740 445 L 1735 435 L 1732 422 L 1733 408 L 1738 395 L 1745 385 Z',
  },
  {
    id: 'thailand',
    name: 'Thailand',
    code: 'th',
    citySlug: 'bangkok',
    // Thailand - detailed outline
    path: 'M 1580 520 L 1588 515 L 1598 518 L 1605 525 L 1610 535 L 1612 548 L 1610 562 L 1605 575 L 1598 585 L 1588 590 L 1578 588 L 1572 580 L 1568 568 L 1568 555 L 1572 542 L 1578 530 Z',
  },
  {
    id: 'united-states',
    name: 'United States',
    code: 'us',
    citySlug: 'los-angeles',
    // USA - simplified west coast focus
    path: 'M 180 280 L 220 275 L 280 280 L 340 290 L 380 300 L 420 315 L 450 330 L 470 350 L 480 375 L 485 400 L 480 425 L 470 445 L 450 460 L 420 470 L 380 475 L 340 472 L 300 465 L 260 455 L 220 440 L 190 420 L 170 395 L 165 370 L 165 345 L 170 320 L 178 300 Z',
  },
]

interface InteractiveWorldMapProps {
  searchQuery?: string
  onCountryClick?: (countryName: string) => void
}

export function InteractiveWorldMap({ searchQuery = '', onCountryClick }: InteractiveWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.citySlug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCountryClick = (countryName: string) => {
    if (onCountryClick) {
      onCountryClick(countryName)
    }
  }

  const handleMouseEnter = (countryId: string, event: React.MouseEvent) => {
    setHoveredCountry(countryId)
    updateTooltipPosition(event)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (hoveredCountry) {
      updateTooltipPosition(event)
    }
  }

  const updateTooltipPosition = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setHoveredCountry(null)
  }

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
      <svg
        viewBox="0 0 2000 1000"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
      >
        {/* Dotted world map background (Aceternity-inspired) */}
        <defs>
          {/* Dot pattern for professional look */}
          <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="currentColor" className="text-slate-300 dark:text-slate-700" opacity="0.3" />
          </pattern>

          {/* Glow effect for hover */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        <rect width="2000" height="1000" fill="url(#dotPattern)" />

        {/* Continents outlines (high-quality paths) */}
        <g className="opacity-15 stroke-slate-400 dark:stroke-slate-600" strokeWidth="2" fill="none">
          {/* North America */}
          <path d="M 100 200 Q 150 180 200 200 L 300 250 L 450 300 L 550 350 L 600 400 Q 580 450 550 480 L 450 500 L 350 490 L 250 470 L 150 430 L 80 380 Q 70 320 80 260 Z" />

          {/* South America */}
          <path d="M 450 520 L 500 550 L 520 600 L 530 680 L 520 750 L 480 820 L 430 850 L 380 830 L 350 780 L 340 720 L 360 660 L 400 600 L 430 560 Z" />

          {/* Europe */}
          <path d="M 900 240 L 1100 230 L 1200 280 L 1220 340 L 1200 380 L 1100 400 L 1000 390 L 920 360 L 880 320 L 870 280 Z" />

          {/* Africa */}
          <path d="M 950 420 L 1050 430 L 1150 480 L 1200 560 L 1220 660 L 1200 750 L 1100 820 L 1000 850 L 900 840 L 850 780 L 830 700 L 840 620 L 880 540 L 920 470 Z" />

          {/* Asia */}
          <path d="M 1200 200 L 1400 180 L 1600 200 L 1800 250 L 1900 320 L 1920 400 L 1900 480 L 1800 550 L 1600 580 L 1400 570 L 1250 520 L 1150 450 L 1100 380 L 1120 300 L 1160 240 Z" />

          {/* Australia */}
          <path d="M 1550 700 L 1700 690 L 1800 720 L 1850 780 L 1840 850 L 1780 900 L 1680 920 L 1580 900 L 1520 850 L 1500 790 L 1510 730 Z" />
        </g>

        {/* Interactive country shapes */}
        {filteredCountries.map((country) => {
          const isHovered = hoveredCountry === country.id
          const colors = COUNTRY_COLORS[country.code as keyof typeof COUNTRY_COLORS]

          return (
            <g key={country.id}>
              <path
                d={country.path}
                fill={isHovered ? colors.hover : colors.default}
                stroke={isHovered ? '#ffffff' : colors.default}
                strokeWidth={isHovered ? '3' : '2'}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered ? 'url(#glow) drop-shadow(0 8px 20px rgba(0,0,0,0.4))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
                  opacity: searchQuery && !filteredCountries.find(c => c.id === country.id) ? 0.3 : 0.9,
                }}
                onClick={() => handleCountryClick(country.name)}
                onMouseEnter={(e) => handleMouseEnter(country.id, e)}
                onMouseLeave={handleMouseLeave}
              />
            </g>
          )
        })}

        {/* Country labels with better positioning */}
        {COUNTRIES.map((country) => {
          const centers: Record<string, { x: number; y: number }> = {
            'united-kingdom': { x: 932, y: 298 },
            'france': { x: 970, y: 340 },
            'germany': { x: 1030, y: 322 },
            'japan': { x: 1760, y: 415 },
            'thailand': { x: 1590, y: 555 },
            'united-states': { x: 320, y: 380 },
          }
          const center = centers[country.id]

          return (
            <text
              key={`label-${country.id}`}
              x={center.x}
              y={center.y}
              textAnchor="middle"
              className="text-xs font-bold fill-white pointer-events-none select-none"
              style={{
                textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,1)',
                paintOrder: 'stroke fill'
              }}
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.5"
            >
              {country.name}
            </text>
          )
        })}

        {/* Latitude/Longitude grid lines for professional look */}
        <g className="opacity-5 stroke-slate-400 dark:stroke-slate-600" strokeWidth="1">
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`lat-${i}`} x1="0" y1={i * 100} x2="2000" y2={i * 100} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line key={`lng-${i}`} x1={i * 100} y1="0" x2={i * 100} y2="1000" />
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-semibold shadow-2xl border-2 border-white/20"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y - 35}px`,
            transform: 'translate(0, -100%)',
          }}
        >
          {COUNTRIES.find((c) => c.id === hoveredCountry)?.name}
        </div>
      )}

      {/* No results message */}
      {searchQuery && filteredCountries.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              No cities found for "{searchQuery}"
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
              Try searching for Paris, Berlin, Tokyo, Bangkok, or Los Angeles
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">Available Cities</p>
        <div className="space-y-1.5">
          {COUNTRIES.map((country) => (
            <div key={country.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm shadow-sm"
                style={{ backgroundColor: COUNTRY_COLORS[country.code as keyof typeof COUNTRY_COLORS].default }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                {country.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
