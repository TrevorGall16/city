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
        <div className="text-8xl mb-6">🧭</div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
          Oops! We can't find that page
        </h1>

        {/* Description */}
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track!
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Go Home
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
