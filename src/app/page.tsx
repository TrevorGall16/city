'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { CityCard } from '@/components/features/CityCard'
import { InteractiveWorldMap } from '@/components/features/InteractiveWorldMap'
import { AdUnit } from '@/components/ads/AdUnit'

// Country flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  France: '🇫🇷',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
  'United Kingdom': '🇬🇧',
  Thailand: '🇹🇭',
  'United States': '🇺🇸',
  Turkey: '🇹🇷',
}

// 1. CITIES LIST
const CITIES = [
  // --- EUROPE ---
  { name: 'Paris', country: 'France', slug: 'paris', image: '/images/paris/hero.jpg', priority: true },
  { name: 'London', country: 'United Kingdom', slug: 'london', image: '/images/london/hero.jpg', priority: true },
  { name: 'Berlin', country: 'Germany', slug: 'berlin', image: '/images/berlin/hero.jpg', priority: false },
  { name: 'Rome', country: 'Italy', slug: 'rome', image: '/images/rome/hero.jpg', priority: true },
  
  // --- ASIA ---
  { name: 'Tokyo', country: 'Japan', slug: 'tokyo', image: '/images/tokyo/hero.jpg', priority: false },
  { name: 'Bangkok', country: 'Thailand', slug: 'bangkok', image: '/images/bangkok/hero.jpg', priority: false },
  
  // --- AMERICAS ---
  { name: 'Los Angeles', country: 'United States', slug: 'los-angeles', image: '/images/los-angeles/hero.jpg', priority: false },
  { name: 'New York', country: 'United States', slug: 'new-york', image: '/images/new-york/hero.jpg', priority: true },

  // --- MIDDLE EAST ---
  { name: 'Istanbul', country: 'Turkey', slug: 'istanbul', image: '/images/istanbul/hero.jpg', priority: true },
]

// 2. REGIONS GROUPING
const REGIONS = [
  {
    name: 'North America',
    countries: [
      { name: 'United States', cities: [
        CITIES.find(c => c.slug === 'new-york')!,
        CITIES.find(c => c.slug === 'los-angeles')!
      ]},
    ],
  },
  {
    name: 'Europe',
    countries: [
      { name: 'United Kingdom', cities: [CITIES.find(c => c.slug === 'london')!] },
      { name: 'France', cities: [CITIES.find(c => c.slug === 'paris')!] },
      { name: 'Germany', cities: [CITIES.find(c => c.slug === 'berlin')!] },
      { name: 'Italy', cities: [CITIES.find(c => c.slug === 'rome')!] },
    ],
  },
  {
    name: 'Asia',
    countries: [
      { name: 'Japan', cities: [CITIES.find(c => c.slug === 'tokyo')!] },
      { name: 'Thailand', cities: [CITIES.find(c => c.slug === 'bangkok')!] },
    ],
  },
  {
    name: 'Middle East',
    countries: [
      { name: 'Turkey', cities: [CITIES.find(c => c.slug === 'istanbul')!] },
    ],
  },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter logic
  const filteredCities = CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCountries = Array.from(
    new Set(filteredCities.map((city) => city.country))
  )

  const handleCityClick = (citySlug: string) => {
    setShowDropdown(false)
    setSearchQuery('')
    router.push(`/city/${citySlug}`)
  }

  const handleCountryClick = (country: string) => {
    setShowDropdown(false)
    setSearchQuery(country)
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  const filteredRegions = REGIONS.map((region) => ({
    ...region,
    countries: region.countries
      .map((country) => ({
        ...country,
        cities: country.cities.filter(
          (city) =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            city.country.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((country) => country.cities.length > 0),
  })).filter((region) => region.countries.length > 0)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      
      {/* ✅ HERO SECTION (UPDATED: Removed overflow-hidden from parent so dropdown can fly out) */}
      <section className="relative min-h-[65vh] flex flex-col justify-center items-center text-center px-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* 1. Background Gradient Mesh (UPDATED: Moved overflow-hidden HERE) */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* 2. Content (Z-Index to sit on top) */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-8 mt-10">
          
          {/* ❌ REMOVED: "Live now" Badge */}
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Travel Smart. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Not Hard.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            The ultimate travel essentials. Local gems, instant translation, and safety tips—minus the fluff.
          </p>

          {/* 3. Search Bar Container with Shadow/Glow */}
          <div className="w-full max-w-2xl mt-12 mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300" ref={searchRef}>
            <div className="relative group">
              {/* Subtle Glow Effect behind search bar */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500 z-10" />
                <input
                  type="text"
                  placeholder="Where to next? Try Paris, Berlin, Tokyo..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                  className="w-full pl-16 pr-6 py-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg shadow-xl transition-all"
                />

                {/* Autocomplete Dropdown */}
                {showDropdown && (filteredCities.length > 0 || filteredCountries.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    {/* Cities Section */}
                    {filteredCities.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Cities
                        </div>
                        {filteredCities.map((city) => (
                          <button
                            key={city.slug}
                            onClick={() => handleCityClick(city.slug)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 group"
                          >
                            <span className="text-2xl">{COUNTRY_FLAGS[city.country]}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {city.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {city.country}
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              View city →
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Countries Section */}
                    {filteredCountries.length > 0 && (
                      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Countries
                        </div>
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => handleCountryClick(country)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-3 group"
                          >
                            <span className="text-2xl">{COUNTRY_FLAGS[country]}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {country}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {filteredCities.filter(c => c.country === country).length} {filteredCities.filter(c => c.country === country).length === 1 ? 'city' : 'cities'}
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              Filter & scroll ↓
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          

        </div>
      </section>

      {/* Interactive World Map - Desktop Only */}
      <section className="hidden lg:block max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-slate-900 dark:text-slate-50 text-center">
          Explore the World
        </h2>
        <InteractiveWorldMap 
          searchQuery={searchQuery} 
          onCountryClick={handleCountryClick} 
        />
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Click on a country to filter cities below
        </p>
      </section>

      {/* Ad Unit */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <AdUnit type="banner" className="max-w-[970px] mx-auto" />
      </section>

      {/* Regional Grid */}
      <section ref={gridRef} className="scroll-mt-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        
        {/* Header Section for Grid */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
            Explore Cities
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Discover your next destination
          </p>

          {/* Active Filter Indicator */}
          {searchQuery && (
            <div className="mt-6 inline-flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-4 py-2">
              <p className="text-sm text-indigo-900 dark:text-indigo-100 mr-4">
                Showing results for <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span>✕</span> Clear
              </button>
            </div>
          )}
        </div>

        {/* The Grid Logic */}
        {filteredRegions.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              We haven't been there yet
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try searching for Paris, Tokyo, Bangkok, or Los Angeles
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {filteredRegions.map((region) => (
              <div key={region.name}>
                <div className="flex items-center mb-8">
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  <h3 className="mx-4 text-xl font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    {region.name}
                  </h3>
                  <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                </div>

                {region.countries.map((country) => (
                  <div key={country.name} className="mb-12 last:mb-0">
                    <h4 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50 flex items-center gap-3">
                      <span className="text-3xl">{COUNTRY_FLAGS[country.name]}</span>
                      {country.name}
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {country.cities.map((city) => (
                        <CityCard 
                          key={city.slug} 
                          name={city.name} 
                          country={city.country} 
                          image={city.image} 
                          slug={city.slug} 
                          priority={city.priority}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}