/**
 * Homepage
 * Following 03_UI section 3.1 (Homepage Template)
 */

import { Search } from 'lucide-react'
import { CityCard } from '@/components/features/CityCard'

export default function HomePage() {
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

        {/* Search Input */}
        <div className="w-full max-w-lg mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search cities..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
            />
          </div>
        </div>
      </section>

      {/* Featured Cities Grid - Regional Grouping */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900">
        <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900 dark:text-slate-50">
          Explore Cities
        </h2>

        {/* 2-Column Regional Grid (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Europe Region */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Europe
            </h3>

            {/* France */}
            <div className="mb-10">
              <h4 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                France
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <CityCard
                  name="Paris"
                  country="France"
                  image="https://placehold.co/800x600/e2e8f0/475569?text=Paris"
                  slug="paris"
                  priority
                />
              </div>
            </div>

            {/* Germany */}
            <div className="mb-10">
              <h4 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                Germany
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <CityCard
                  name="Berlin"
                  country="Germany"
                  image="https://placehold.co/800x600/e2e8f0/475569?text=Berlin"
                  slug="berlin"
                />
              </div>
            </div>
          </div>

          {/* Asia Region */}
          <div>
            <h3 className="text-xl font-semibold mb-8 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Asia
            </h3>

            {/* Japan */}
            <div className="mb-10">
              <h4 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 dark:text-slate-50">
                Japan
              </h4>
              <div className="grid grid-cols-1 gap-6">
                <CityCard
                  name="Tokyo"
                  country="Japan"
                  image="https://placehold.co/1920x1080/ffffff/dc143c?text=Tokyo"
                  slug="tokyo"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
