/**
 * Homepage
 * Following 03_UI section 3.1 (Homepage Template)
 * Features: Hero search, Interactive world map (desktop), Regional grid (mobile)
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { CityCard } from '@/components/features/CityCard'
import { InteractiveWorldMap } from '@/components/features/InteractiveWorldMap'

// Country flag emojis
const COUNTRY_FLAGS: Record<string, string> = {
  France: '🇫🇷',
  Germany: '🇩🇪',
  Japan: '🇯🇵',
}

// City data for filtering
const CITIES = [
  { name: 'Paris', country: 'France', slug: 'paris', image: 'https://placehold.co/800x600/e2e8f0/475569?text=Paris', priority: true },
  { name: 'Berlin', country: 'Germany', slug: 'berlin', image: 'https://placehold.co/800x600/e2e8f0/475569?text=Berlin', priority: false },
  { name: 'Tokyo', country: 'Japan', slug: 'tokyo', image: 'https://placehold.co/1920x1080/ffffff/dc143c?text=Tokyo', priority: false },
]

const REGIONS = [
  {
    name: 'Europe',
    countries: [
      { name: 'France', cities: [CITIES[0]] },
      { name: 'Germany', cities: [CITIES[1]] },
    ],
  },
  {
    name: 'Asia',
    countries: [
      { name: 'Japan', cities: [CITIES[2]] },
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

  // Filter cities based on search query
  const filteredCities = CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get unique countries from filtered cities
  const filteredCountries = Array.from(
    new Set(filteredCities.map((city) => city.country))
  )

  // Handle city click (direct navigation)
  const handleCityClick = (citySlug: string) => {
    setShowDropdown(false)
    setSearchQuery('')
    router.push(`/city/${citySlug}`)
  }

  // Handle country click (filter and scroll)
  const handleCountryClick = (country: string) => {
    setShowDropdown(false)
    setSearchQuery(country)

    // Smooth scroll to grid section after a short delay
    setTimeout(() => {
      gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  // Show dropdown when typing
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowDropdown(e.target.value.length > 0)
  }

  // Filter regions based on search query
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
    <main className="min-h-screen">
      {/* Hero Search Module */}
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center px-4 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Your Travel Cheat Sheet
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Curated recommendations with instant translation for travelers.
          Navigate foreign cities without language barriers.
        </p>

        {/* Large Hero Search Input with Autocomplete */}
        <div className="w-full max-w-2xl mt-10" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500 z-10" />
            <input
              type="text"
              placeholder="Where to next? Try Paris, Berlin, Tokyo..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
              className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg shadow-lg transition-all"
            />

            {/* Autocomplete Dropdown */}
            {showDropdown && (filteredCities.length > 0 || filteredCountries.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
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

                {/* No results */}
                {filteredCities.length === 0 && filteredCountries.length === 0 && (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                    No cities or countries found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {searchQuery && !showDropdown && (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Found {filteredCities.length} {filteredCities.length === 1 ? 'city' : 'cities'}
            </p>
          )}
        </div>
      </section>

      {/* Interactive World Map - Desktop Only */}
      <section className="hidden lg:block max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900">
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

      {/* Regional Grid - Mobile and Tablet, Also shows filtered results on desktop */}
      <section ref={gridRef} className="lg:hidden max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900 dark:text-slate-50">
          Explore Cities
        </h2>

        {filteredRegions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No cities found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredRegions.map((region) => (
              <div key={region.name}>
                <h3 className="text-xl font-semibold mb-8 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {region.name}
                </h3>

                {region.countries.map((country) => (
                  <div key={country.name} className="mb-10">
                    <h4 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                      {country.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
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

      {/* Desktop: Show all cities list below map for accessibility */}
      <section ref={gridRef} className="hidden lg:block max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900 dark:text-slate-50">
          All Cities
        </h2>

        {filteredRegions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No cities found for "{searchQuery}"
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredRegions.map((region) => (
              <div key={region.name}>
                <h3 className="text-xl font-semibold mb-8 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  {region.name}
                </h3>

                {region.countries.map((country) => (
                  <div key={country.name} className="mb-10">
                    <h4 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                      {country.name}
                    </h4>
                    <div className="grid grid-cols-1 gap-6">
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
