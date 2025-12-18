'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { ZoomOut } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

const BRAND_COLORS: Record<string, string> = {
  'United Kingdom': '#1e3a8a', 'France': '#3b82f6', 'Germany': '#eab308', 'Italy': '#16a34a',
  'Japan': '#be123c', 'Thailand': '#0d9488', 'China': '#ea580c', 'India': '#f97316',
  'United States of America': '#2563eb', 'Brazil': '#15803d', 
  'Turkey': '#991b1b', 'United Arab Emirates': '#065f46', 'Saudi Arabia': '#14532d'
}

// ✅ 1. ADJUSTED: Lower zoom levels and shifted centers for better "Click-ability"
const REGIONS: Record<string, { center: [number, number], zoom: number }> = {
  'Europe': { center: [10, 48], zoom: 3 }, // 📍 Moved south and zoomed out to show the whole continent
  'Asia': { center: [90, 25], zoom: 2.2 }, 
  'North America': { center: [-100, 40], zoom: 2 },
  'South America': { center: [-60, -15], zoom: 2 }, // 📍 Lifted the center up so the bottom isn't cut off
  'Middle East': { center: [45, 25], zoom: 3 }, 
  'World': { center: [0, 15], zoom: 1 } // 📍 Shifted World center to keep Southern Hemisphere safe
}

const NAME_MAPPING: Record<string, string> = {
  'United States': 'United States of America',
  'Hong Kong': 'China'
}

interface InteractiveWorldMapProps {
  searchQuery?: string
  onCountryClick?: (countryName: string) => void
  cities: any[]
}

export function InteractiveWorldMap({ searchQuery = '', onCountryClick, cities }: InteractiveWorldMapProps) {
  const [position, setPosition] = useState(REGIONS['World'])
  const [activeRegion, setActiveRegion] = useState('World')
  const [tooltipContent, setTooltipContent] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!searchParams.get('search')) {
      handleReset()
    }
  }, [searchParams])

  const { activeCountries, countryToRegion } = useMemo(() => {
    const active: Record<string, string> = {}
    const mapping: Record<string, string> = {}

    cities.forEach(city => {
      const geoName = NAME_MAPPING[city.country] || city.country
      active[geoName] = BRAND_COLORS[geoName] || '#4f46e5'
      
      if (['Brazil'].includes(city.country)) mapping[geoName] = 'South America'
      else if (['Japan', 'China', 'Thailand', 'Hong Kong'].includes(city.country)) mapping[geoName] = 'Asia'
      else if (['France', 'Germany', 'Italy', 'United Kingdom'].includes(city.country)) mapping[geoName] = 'Europe'
      else if (['United States', 'Canada'].includes(city.country)) mapping[geoName] = 'North America'
      else mapping[geoName] = 'Middle East'
    })
    return { activeCountries: active, countryToRegion: mapping }
  }, [cities])

  const handleCountryClick = (geo: any) => {
    const countryName = geo.properties.name
    const appName = countryName === 'United States of America' ? 'United States' : countryName
    const region = countryToRegion[countryName]

    if (activeRegion === 'World' && region) {
      setPosition(REGIONS[region])
      setActiveRegion(region)
      return 
    }

    if (activeCountries[countryName]) {
      const searchTarget = countryName === 'China' && cities.some(c => c.country === 'Hong Kong') 
        ? 'Hong Kong' 
        : appName
      onCountryClick?.(searchTarget)
    }
  }

  const handleReset = () => {
    setPosition(REGIONS['World'])
    setActiveRegion('World')
  }

  return (
    <div className="w-full h-[550px] bg-slate-200 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 relative overflow-hidden">
      
      {activeRegion !== 'World' && (
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 shadow-xl rounded-full text-sm font-bold border-2 border-indigo-500 hover:scale-105 transition-all"
        >
          <ZoomOut className="w-4 h-4 text-indigo-600" /> Reset to World
        </button>
      )}

      <ComposableMap 
        projection="geoMercator" 
        projectionConfig={{ scale: 80 }} // ✅ 80 is the "Golden Ratio" for this container
        width={800} 
        height={450}
      >
        <ZoomableGroup 
          center={position.center} 
          zoom={position.zoom}
          filterZoomEvent={() => false}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name
                const color = activeCountries[countryName]
                const isDimmed = searchQuery && !countryName.toLowerCase().includes(searchQuery.toLowerCase()) && !activeCountries[countryName]

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => color && setTooltipContent(countryName)}
                    onMouseLeave={() => setTooltipContent('')}
                    onClick={() => handleCountryClick(geo)}
                    style={{
                      default: {
                        fill: isDimmed ? '#d1d5db' : (color || '#a1a1aa'),
                        stroke: "#f4f4f5", strokeWidth: 0.5, outline: "none",
                        cursor: color ? "pointer" : "default"
                      },
                      hover: {
                        fill: color ? '#1e40af' : '#71717a',
                        stroke: "#ffffff", strokeWidth: 1, outline: "none"
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {tooltipContent && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl pointer-events-none border border-slate-700">
          {tooltipContent === 'United States of America' ? 'United States' : tooltipContent}
        </div>
      )}
    </div>
  )
}