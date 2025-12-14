'use client'

import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { X, ZoomOut } from 'lucide-react'

// 1. Map Data
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

// 2. Active Destinations & Colors
// Colors chosen to match national identity/flags
const ACTIVE_COUNTRIES: Record<string, string> = {
  // Europe
  'United Kingdom': '#1e3a8a',
  'France': '#2563eb',
  'Germany': '#eab308',
  'Italy': '#16a34a',
  
  // Asia
  'Japan': '#dc2626',
  'Thailand': '#059669',
  'China': '#de2910', // Red
  'India': '#ff9933', // Saffron/Orange
  
  // Americas
  'United States of America': '#3b82f6',
  
  // Middle East (New)
  'Turkey': '#e30a17', // Turkish Red
  'United Arab Emirates': '#00732f', // UAE Green
  'Saudi Arabia': '#165d31', // Saudi Green
}

const NAME_MAPPING: Record<string, string> = {
  'United States': 'United States of America'
}

// 3. Region Configurations
const REGIONS: Record<string, { center: [number, number], zoom: number }> = {
  'Europe': { center: [10, 50], zoom: 4 },
  'Asia': { center: [100, 30], zoom: 3 },
  'North America': { center: [-100, 40], zoom: 2.5 },
  'Middle East': { center: [45, 25], zoom: 4 }, // ✅ NEW ZOOM REGION
  'World': { center: [0, 20], zoom: 1 }
}

// Mapping countries to their regions
const COUNTRY_TO_REGION: Record<string, string> = {
  'United Kingdom': 'Europe',
  'France': 'Europe',
  'Germany': 'Europe',
  'Italy': 'Europe',
  
  'Japan': 'Asia',
  'Thailand': 'Asia',
  'China': 'Asia',
  'India': 'Asia',
  
  'United States of America': 'North America',
  
  'Turkey': 'Middle East',
  'United Arab Emirates': 'Middle East',
  'Saudi Arabia': 'Middle East',
}

interface InteractiveWorldMapProps {
  searchQuery?: string
  onCountryClick?: (countryName: string) => void
}

export function InteractiveWorldMap({ searchQuery = '', onCountryClick }: InteractiveWorldMapProps) {
  const [tooltipContent, setTooltipContent] = useState('')
  const [position, setPosition] = useState(REGIONS['World'])
  const [activeRegion, setActiveRegion] = useState('World')

  const handleCountryClick = (countryName: string) => {
    // 1. Normalize Name
    const appName = countryName === 'United States of America' ? 'United States' : countryName
    const region = COUNTRY_TO_REGION[countryName]

    // 2. If we are in World View, ZOOM IN first
    if (activeRegion === 'World' && region) {
      setPosition(REGIONS[region])
      setActiveRegion(region)
      return // Stop here, don't scroll yet
    }

    // 3. If we are ALREADY zoomed in (or clicking same region), SELECT the country
    if (activeRegion === region || !region) {
      if (ACTIVE_COUNTRIES[countryName]) {
        onCountryClick?.(appName)
      }
    }
  }

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent map click logic
    setPosition(REGIONS['World'])
    setActiveRegion('World')
  }

  return (
    <div className="w-full h-[500px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col items-center justify-center relative transition-colors duration-500">
      
      {/* Zoom Out Button (Visible only when zoomed in) */}
      {activeRegion !== 'World' && (
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 shadow-lg rounded-full text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
        >
          <ZoomOut className="w-4 h-4" />
          Reset Map
        </button>
      )}

      {/* Map Container */}
      <ComposableMap 
        projection="geoMercator" 
        // Scale 100 fixes the cropping issue (Standard view)
        projectionConfig={{ scale: 100 }} 
        // Disable scroll zoom to prevent accidental page scrolls
        width={800}
        height={400}
      >
        <ZoomableGroup 
          center={position.center} 
          zoom={position.zoom} 
          onMoveEnd={(pos) => setPosition(pos)} // Sync state
          filterZoomEvent={() => false} // Disable mouse wheel zoom
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties.name
                
                // Is this country in our active list?
                const isActive = ACTIVE_COUNTRIES[countryName] || ACTIVE_COUNTRIES[NAME_MAPPING[countryName] || '']
                const color = isActive || '#e2e8f0'
                
                const isDimmed = searchQuery && 
                  !countryName.toLowerCase().includes(searchQuery.toLowerCase()) && 
                  !isActive

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      if (isActive) setTooltipContent(countryName)
                    }}
                    onMouseLeave={() => {
                      setTooltipContent('')
                    }}
                    onClick={() => handleCountryClick(countryName)}
                    style={{
                      default: {
                        fill: isDimmed && searchQuery ? '#f1f5f9' : color,
                        stroke: "#ffffff",
                        strokeWidth: 0.5,
                        outline: "none",
                        cursor: isActive ? "pointer" : "default",
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: isActive ? '#1e40af' : '#cbd5e1',
                        stroke: "#ffffff",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: isActive ? "pointer" : "default",
                        transition: "all 250ms"
                      },
                      pressed: {
                        fill: isActive ? '#1e3a8a' : '#cbd5e1',
                        outline: "none",
                      }
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip Overlay */}
      {tooltipContent && (
        <div className="absolute top-4 bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg pointer-events-none transform transition-all duration-200 z-10">
          {tooltipContent === 'United States of America' ? 'United States' : tooltipContent}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <p className="text-xs text-slate-400 font-medium bg-white/80 dark:bg-slate-900/80 inline-block px-3 py-1 rounded-full backdrop-blur-sm shadow-sm border border-slate-100 dark:border-slate-800">
          {activeRegion === 'World' 
            ? "Click a region to zoom in" 
            : `Exploring ${activeRegion} • Select a country`
          }
        </p>
      </div>
    </div>
  )
}