/**
 * Footer Component
 * Global footer with links and copyright information
 */

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              CitySheet
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              No-fluff travel guides with instant translation.
              Navigate foreign cities with confidence.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/city/paris" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Paris
                </Link>
              </li>
              <li>
                <Link href="/city/berlin" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Berlin
                </Link>
              </li>
              <li>
                <Link href="/city/tokyo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Tokyo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Company
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  About CitySheet
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Our Methodology
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How to Use
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Submit a Correction
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@citysheet.com"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © {currentYear} CitySheet. All rights reserved.
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Built with ❤️ using Next.js, Tailwind CSS, and Supabase
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
