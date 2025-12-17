/**
 * HOME PAGE CLIENT COMPONENT
 * 
 * This handles all interactivity (search, filtering, map clicks)
 * while keeping the main page as a Server Component for SEO
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { CityCard } from '@/components/features/CityCard'
import { InteractiveWorldMap } from '@/components/features/InteractiveWorldMap'
import { AdUnit } from '@/components/ads/AdUnit'

// Country flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Japan': '🇯🇵',
  'United Kingdom': '🇬🇧',
  'Thailand': '🇹🇭',
  'United States': '🇺🇸',
  'Turkey': '🇹🇷',
  'Italy': '🇮🇹',
  'Spain': '🇪🇸',
  'China': '🇨🇳',
  'South Korea': '🇰🇷',
  'Singapore': '🇸🇬',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'Brazil': '🇧🇷',
  'Australia': '🇦🇺',
  'United Arab Emirates': '🇦🇪',
  'Saudi Arabia': '🇸🇦',
  'Egypt': '🇪🇬',
  'India': '🇮🇳',
  'Hong Kong': '🇭🇰',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Portugal': '🇵🇹',
  'Greece': '🇬🇷',
  'Czech Republic': '🇨🇿',
}

interface City {
  name: string
  country: string
  country_code: string
  slug: string
  image: string
  intro_vibe?: string
  priority: boolean
}

interface Country {
  name: string
  country_code: string
  cities: City[]
}

interface Region {
  name: string
  countries: Country[]
}

interface HomePageClientProps {
  cities: City[]
  regions: Region[]
}

export function HomePageClient({ cities, regions }: HomePageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize search from URL query parameter
  const initialSearch = searchParams?.get('search') || ''
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Sync search query with URL
  useEffect(() => {
    const query = searchParams?.get('search') || ''
    if (query !== searchQuery) {
      setSearchQuery(query)
    }
  }, [searchParams])

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
  const filteredCities = cities.filter(
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
    // Update URL to clear search
    router.push(`/${citySlug}`)
  }

  const handleCountryClick = (country: string) => {
    setShowDropdown(false)
    setSearchQuery(country)
    
    // Update URL with search parameter
    const params = new URLSearchParams()
    params.set('search', country)
    router.push(`/?${params.toString()}`, { scroll: false })
    
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    setShowDropdown(value.length > 0)
    
    // Update URL with search parameter
    if (value) {
      const params = new URLSearchParams()
      params.set('search', value)
      router.push(`/?${params.toString()}`, { scroll: false })
    } else {
      router.push('/', { scroll: false })
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    router.push('/', { scroll: false })
  }

  const filteredRegions = regions.map((region) => ({
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
      
      {/* HERO SECTION - Reduced height for faster content access */}
      <section className="relative min-h-[45vh] flex flex-col justify-center items-center text-center px-4 border-b border-slate-200 dark:border-slate-800">
        
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 dark:bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 mt-10">
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Travel Smart. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Not Hard.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Essential travel guides for {cities.length} cities. Local food spots, must-see sights, and practical tips—minus the fluff.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-2xl mt-8 mx-auto animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300" ref={searchRef}>
            <div className="relative group">
              {/* Subtle Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search cities or countries..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-14 pr-6 py-4 text-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-lg hover:shadow-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Search Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    
                    {/* Cities Section */}
                    {filteredCities.length > 0 && (
                      <div className="p-2">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Cities ({filteredCities.length})
                        </div>
                        {filteredCities.slice(0, 10).map((city) => (
                          <button
                            key={city.slug}
                            onClick={() => handleCityClick(city.slug)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 group"
                          >
                            <span className="text-2xl">{COUNTRY_FLAGS[city.country] || '🌍'}</span>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {city.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400">
                                {city.country}
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              View guide →
                            </div>
                          </button>
                        ))}
                        {filteredCities.length > 10 && (
                          <div className="px-4 py-2 text-xs text-slate-500 dark:text-slate-400 text-center">
                            +{filteredCities.length - 10} more cities
                          </div>
                        )}
                      </div>
                    )}

                    {/* Countries Section */}
                    {filteredCountries.length > 0 && filteredCities.length > 0 && (
                      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                        <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Countries ({filteredCountries.length})
                        </div>
                        {filteredCountries.map((country) => (
                          <button
                            key={country}
                            onClick={() => handleCountryClick(country)}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-3 group"
                          >
                            <span className="text-2xl">{COUNTRY_FLAGS[country] || '🌍'}</span>
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

                    {/* No Results */}
                    {filteredCities.length === 0 && (
                      <div className="p-8 text-center">
                        <div className="text-4xl mb-3">🗺️</div>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                          No cities found for "{searchQuery}"
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                          Try searching for Paris, Tokyo, or New York
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Banner - Between Hero and Content */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 border-b border-slate-200 dark:border-slate-800">
        <AdUnit type="banner" className="max-w-[970px] mx-auto" />
      </section>

      {/* Interactive World Map - Desktop Only */}
      <section className="hidden lg:block max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-12 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-slate-50 text-center">
          Explore the World
        </h2>
        <InteractiveWorldMap 
          searchQuery={searchQuery} 
          onCountryClick={handleCountryClick} 
        />
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          Click on a country to filter cities below
        </p>
      </section>

      {/* Regional Grid */}
      <section ref={gridRef} className="scroll-mt-20 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            {searchQuery ? 'Search Results' : 'Explore Cities'}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {searchQuery 
              ? `Found ${filteredCities.length} ${filteredCities.length === 1 ? 'city' : 'cities'}`
              : `${cities.length} cities and counting`
            }
          </p>

          {/* Active Filter Indicator */}
          {searchQuery && (
            <div className="mt-6 inline-flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg px-4 py-2.5 gap-4">
              <p className="text-sm text-indigo-900 dark:text-indigo-100">
                Filtering: <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <button 
                onClick={clearSearch}
                className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                <span>✕</span> Clear
              </button>
            </div>
          )}
        </div>

        {/* Grid Content */}
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
              onClick={clearSearch}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Show All Cities
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {filteredRegions.map((region) => (
              <div key={region.name}>
                {/* Region Header - Simplified */}
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider border-l-4 border-indigo-600 pl-4">
                    {region.name}
                  </h3>
                </div>

                {region.countries.map((country) => (
                  <div key={country.name} className="mb-10 last:mb-0">
                    <h4 className="text-xl md:text-2xl font-bold mb-5 text-slate-900 dark:text-slate-50 flex items-center gap-3">
                      <span className="text-3xl">{COUNTRY_FLAGS[country.name] || '🌍'}</span>
                      {country.name}
                      <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
                        ({country.cities.length})
                      </span>
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

      {/* Footer Ad */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <AdUnit type="banner" className="max-w-[970px] mx-auto" />
      </section>
    </main>
  )
}
