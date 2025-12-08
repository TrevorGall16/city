/**
 * Interactive World Map Component
 * SVG-based world map that highlights countries with available city data
 * Features: Hover states, tooltips, click navigation
 */

'use client'

import { useState } from 'react'

// ============================================================================
// COUNTRY THEME COLORS
// ============================================================================
// These colors match the COUNTRY_THEMES in city/[citySlug]/page.tsx
// Edit these hex values to customize country highlight colors
// ============================================================================
const COUNTRY_COLORS = {
  fr: {
    default: '#3b82f6', // Blue-500 for France
    hover: '#1d4ed8',   // Blue-700 on hover
  },
  de: {
    default: '#eab308', // Yellow-500 for Germany
    hover: '#a16207',   // Yellow-700 on hover
  },
  jp: {
    default: '#ef4444', // Red-500 for Japan
    hover: '#b91c1c',   // Red-700 on hover
  },
}

interface CountryData {
  id: string
  name: string
  code: string
  citySlug: string // First city for this country
  path: string     // SVG path data
}

// Simplified SVG paths for countries (approximate shapes on world map projection)
const COUNTRIES: CountryData[] = [
  {
    id: 'france',
    name: 'France',
    code: 'fr',
    citySlug: 'paris',
    // Simplified France shape in Western Europe (approximate coordinates)
    path: 'M 420 240 L 425 235 L 435 235 L 440 240 L 445 245 L 445 255 L 440 265 L 430 270 L 420 268 L 415 260 L 415 250 Z',
  },
  {
    id: 'germany',
    name: 'Germany',
    code: 'de',
    citySlug: 'berlin',
    // Simplified Germany shape in Central Europe (approximate coordinates)
    path: 'M 450 220 L 465 218 L 475 220 L 480 230 L 478 240 L 470 248 L 460 250 L 452 245 L 448 235 L 450 225 Z',
  },
  {
    id: 'japan',
    name: 'Japan',
    code: 'jp',
    citySlug: 'tokyo',
    // Simplified Japan shape in East Asia (approximate coordinates)
    path: 'M 820 260 L 825 255 L 832 258 L 835 265 L 838 275 L 835 285 L 830 290 L 825 288 L 822 280 L 820 270 Z',
  },
]

interface InteractiveWorldMapProps {
  searchQuery?: string // Optional search filter
  onCountryClick?: (countryName: string) => void // Callback for country click (filter & scroll)
}

export function InteractiveWorldMap({ searchQuery = '', onCountryClick }: InteractiveWorldMapProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Filter countries based on search query
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
    <div className="relative w-full h-[500px] bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
      >
        {/* Base world map outline (simplified continents) */}
        <g className="opacity-20 fill-slate-400 dark:fill-slate-600">
          {/* Europe outline */}
          <path d="M 380 180 L 520 180 L 540 240 L 520 280 L 380 280 L 360 240 Z" />

          {/* Asia outline */}
          <path d="M 540 150 L 900 150 L 920 300 L 880 380 L 540 360 L 540 240 Z" />

          {/* Americas outline */}
          <path d="M 80 120 L 180 100 L 250 180 L 280 280 L 200 420 L 120 380 L 80 280 Z" />

          {/* Africa outline */}
          <path d="M 400 280 L 550 280 L 580 380 L 520 460 L 420 460 L 380 380 Z" />
        </g>

        {/* Interactive country shapes */}
        {filteredCountries.map((country) => {
          const isHovered = hoveredCountry === country.id
          const colors = COUNTRY_COLORS[country.code as keyof typeof COUNTRY_COLORS]

          return (
            <path
              key={country.id}
              d={country.path}
              fill={isHovered ? colors.hover : colors.default}
              stroke={isHovered ? '#ffffff' : colors.default}
              strokeWidth={isHovered ? '2' : '1'}
              className="cursor-pointer transition-all duration-200 drop-shadow-lg"
              style={{
                filter: isHovered ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                opacity: searchQuery && !filteredCountries.find(c => c.id === country.id) ? 0.3 : 1,
              }}
              onClick={() => handleCountryClick(country.name)}
              onMouseEnter={(e) => handleMouseEnter(country.id, e)}
              onMouseLeave={handleMouseLeave}
            />
          )
        })}

        {/* Country labels (always visible for available countries) */}
        {COUNTRIES.map((country) => {
          // Calculate center point of path (approximate)
          const centers = {
            france: { x: 430, y: 250 },
            germany: { x: 465, y: 235 },
            japan: { x: 828, y: 275 },
          }
          const center = centers[country.id as keyof typeof centers]

          return (
            <text
              key={`label-${country.id}`}
              x={center.x}
              y={center.y}
              textAnchor="middle"
              className="text-xs font-semibold fill-white pointer-events-none"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            >
              {country.name}
            </text>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hoveredCountry && (
        <div
          className="absolute pointer-events-none bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-2 rounded-lg text-sm font-medium shadow-xl"
          style={{
            left: `${tooltipPos.x + 10}px`,
            top: `${tooltipPos.y - 30}px`,
            transform: 'translate(0, -100%)',
          }}
        >
          {COUNTRIES.find((c) => c.id === hoveredCountry)?.name}
        </div>
      )}

      {/* No results message */}
      {searchQuery && filteredCountries.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              No cities found for "{searchQuery}"
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
              Try searching for Paris, Berlin, or Tokyo
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 rounded-lg px-4 py-3 shadow-lg border border-slate-200 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Available Cities</p>
        <div className="space-y-1.5">
          {COUNTRIES.map((country) => (
            <div key={country.id} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: COUNTRY_COLORS[country.code as keyof typeof COUNTRY_COLORS].default }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {country.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
