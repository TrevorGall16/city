'use client'

/**
 * AffiliateSection Component
 * Displays Amazon affiliate products with clean card layout
 * Placed after Culture & Etiquette, before Discover section
 */

import { ExternalLink } from 'lucide-react'
import Image from 'next/image'

export interface AffiliateProduct {
  id: string
  title: string
  image: string
  reason: string
  amazon_url: string
  category?: string
}

interface AffiliateSectionProps {
  products: AffiliateProduct[]
  cityName: string
  countryCode: string // Used for smart Amazon routing
  accentText?: string
}

// Smart Amazon domain routing based on country
function getAmazonDomain(countryCode: string): string {
  const domainMap: Record<string, string> = {
    'gb': 'www.amazon.co.uk',    // United Kingdom
    'fr': 'www.amazon.fr',        // France
    'de': 'www.amazon.de',        // Germany
    'jp': 'www.amazon.com',       // Japan (use .com for intl)
    'th': 'www.amazon.com',       // Thailand (use .com)
    'us': 'www.amazon.com',       // USA
  }

  return domainMap[countryCode.toLowerCase()] || 'www.amazon.com'
}

// Generate Amazon affiliate URL with smart routing
function generateAmazonAffiliateUrl(searchQuery: string, countryCode: string): string {
  const domain = getAmazonDomain(countryCode)
  const tag = 'canibringonpl-20'
  const encodedQuery = encodeURIComponent(searchQuery)

  return `https://${domain}/s?k=${encodedQuery}&tag=${tag}`
}

export function AffiliateSection({ products, cityName, countryCode, accentText = 'text-indigo-900 dark:text-indigo-400' }: AffiliateSectionProps) {
  if (!products || products.length === 0) {
    return null
  }

  return (
    <section
      id="travel-essentials"
      className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-950 border-b border-amber-100 dark:border-amber-900/20"
    >
      <div className="mb-8">
        <h2 className={`text-3xl md:text-4xl font-bold ${accentText} mb-2 flex items-center gap-3`}>
          <span className="text-2xl">🎒</span>
          Travel Essentials for {cityName}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Recommended gear to make your trip smoother
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          // Generate smart Amazon URL based on country
          const affiliateUrl = generateAmazonAffiliateUrl(product.title, countryCode)

          return (
            <a
              key={product.id}
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group bg-white dark:bg-slate-900 rounded-xl border-2 border-amber-200 dark:border-amber-900/40 overflow-hidden hover:border-amber-400 dark:hover:border-amber-700 hover:shadow-lg transition-all duration-300 active:scale-[0.98]"
            >
            {/* Product Image */}
              <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Product Details */}
              <div className="p-5">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {product.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <span className="font-medium text-amber-700 dark:text-amber-500">Why you need it:</span>{' '}
                  {product.reason}
                </p>

                {/* CTA Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-500 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
                    View on Amazon
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Disclosure */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 text-center">
        As an Amazon Associate, we earn from qualifying purchases. Prices and availability subject to change.
      </p>
    </section>
  )
}
