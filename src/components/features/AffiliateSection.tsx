'use client'

/**
 * 🛰️ MASTER AI: AFFILIATE SECTION (GOLDEN MASTER V5.0)
 * ✅ Combined: Your Smart Routing + My Crash-Proof Logic
 * ✅ Features: Smart Amazon Domain Mapping, Search-Query URLs, High-Saturation Amber Styling
 */

import { ExternalLink, ShoppingBag } from 'lucide-react'
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
  countryCode: string 
  accentText?: string
}

// 1. Smart Amazon domain routing based on country
function getAmazonDomain(countryCode: string): string {
  const domainMap: Record<string, string> = {
    'gb': 'www.amazon.co.uk',    // United Kingdom
    'fr': 'www.amazon.fr',       // France
    'de': 'www.amazon.de',       // Germany
    'it': 'www.amazon.it',       // Italy
    'es': 'www.amazon.es',       // Spain
    'jp': 'www.amazon.co.jp',    // Japan 
    'us': 'www.amazon.com',      // USA
    'ca': 'www.amazon.ca',       // Canada
  }
  return domainMap[countryCode.toLowerCase()] || 'www.amazon.com'
}

// 2. Generate Amazon affiliate URL with smart routing
function generateAmazonAffiliateUrl(searchQuery: string, countryCode: string): string {
  const domain = getAmazonDomain(countryCode)
  const tag = 'canibringonpl-20' // Your affiliate tag
  const encodedQuery = encodeURIComponent(searchQuery)
  return `https://${domain}/s?k=${encodedQuery}&tag=${tag}`
}

export function AffiliateSection({ 
  products, 
  cityName, 
  countryCode, 
  accentText = 'text-indigo-900 dark:text-indigo-400' 
}: AffiliateSectionProps) {

  // 🛡️ CRASH-PROOF AUDIT: Filter out malformed items (Empty images/titles)
  // This prevents the "empty string src" and "missing alt" errors from Rio/China
  const validProducts = (products || []).filter(p => 
    p && p.title && p.image && p.image !== ""
  );

  if (validProducts.length === 0) return null;

  return (
    <section
      id="travel-essentials"
      className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-950 border-y border-amber-100 dark:border-amber-900/20 rounded-[3rem] my-12"
    >
      <div className="mb-10">
        <h2 className={`text-3xl md:text-5xl font-black ${accentText} mb-3 flex items-center gap-4 tracking-tighter`}>
          <span className="bg-amber-400 p-2 rounded-2xl shadow-lg shadow-amber-400/20 text-3xl">🎒</span>
          Travel Essentials for {cityName}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
          Curated gear recommended by locals to make your trip smoother.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {validProducts.map((product, idx) => {
          // Generate smart Amazon URL based on countryCode
          const affiliateUrl = generateAmazonAffiliateUrl(product.title, countryCode)
          
          // Generate stable unique key to prevent "Unique Key" Console Error
          const uniqueKey = product.id || `aff-${countryCode}-${idx}`;

          return (
            <a
              key={uniqueKey}
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-amber-200 dark:border-amber-900/40 overflow-hidden hover:border-amber-500 dark:hover:border-amber-600 hover:shadow-2xl transition-all duration-500 active:scale-[0.98] flex flex-col h-full shadow-sm"
            >
              {/* Product Image Container */}
              <div className="relative w-full h-56 bg-slate-50 dark:bg-slate-800/50 p-6 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              {/* Product Details */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-3 py-1 rounded-full">
                    {product.category || 'Must-Have'}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-tight">
                  {product.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  <span className="font-black text-amber-700 dark:text-amber-500 uppercase text-[10px] tracking-widest block mb-1">
                    Why you need it:
                  </span>
                  {product.reason}
                </p>

                {/* Styled Action Button */}
                <div className="mt-auto flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-500 group-hover:text-amber-900 dark:group-hover:text-amber-300 transition-colors">
                    View on Amazon
                  </span>
                  <div className="bg-amber-100 dark:bg-amber-900/40 p-2 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </a>
          )
        })}
      </div>

      {/* Disclosure - Now themed and centered */}
      <div className="mt-12 p-6 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-amber-100 dark:border-amber-900/20">
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-widest leading-loose">
          As an Amazon Associate, we earn from qualifying purchases. 
          <span className="mx-2">•</span> 
          Prices and availability subject to change.
          <span className="mx-2">•</span> 
          Smart routing detects your region for the best shopping experience.
        </p>
      </div>
    </section>
  )
}