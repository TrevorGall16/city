/**
 * InfoPageLayout Component
 * Reusable layout for trust and informational pages
 * Provides consistent styling, breadcrumbs, and structure
 */

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface InfoPageLayoutProps {
  title: string
  lastUpdated: string
  breadcrumbs?: { label: string; href: string }[]
  children: React.ReactNode
}

export function InfoPageLayout({
  title,
  lastUpdated,
  breadcrumbs = [],
  children,
}: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6" aria-label="Breadcrumb">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <Link
                  href={crumb.href}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {crumb.label}
                </Link>
              </div>
            ))}
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-slate-100">{title}</span>
          </nav>

          {/* Page Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {title}
          </h1>

          {/* Last Updated */}
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last updated: <time dateTime={lastUpdated}>{new Date(lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </p>
        </div>
      </div>

      {/* Content Section */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-semibold
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
          prose-ul:my-6 prose-li:my-2
          prose-strong:text-slate-900 dark:prose-strong:text-slate-50
          prose-code:text-indigo-600 dark:prose-code:text-indigo-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
          {children}
        </div>

        {/* Back to Home Link */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to CitySheet
          </Link>
        </div>
      </article>
    </div>
  )
}
