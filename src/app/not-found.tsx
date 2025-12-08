/**
 * Custom 404 Not Found Page
 * Shown when a user navigates to a non-existent route
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="text-8xl mb-6">🗺️</div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Oops! This city isn't on our map yet
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          We haven't visited this destination yet, but we're constantly expanding our travel guides.
          Check back soon or explore our current cities!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          <Link
            href="/city/paris"
            className="px-8 py-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-50 font-semibold rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            Explore Paris
          </Link>
        </div>

        {/* 404 Code */}
        <p className="mt-12 text-sm text-slate-500 dark:text-slate-400">
          Error 404 - Page Not Found
        </p>
      </div>
    </div>
  )
}
