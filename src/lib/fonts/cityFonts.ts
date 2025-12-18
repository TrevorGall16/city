/**
 * City-Specific Font Loader
 * Dynamically imports fonts only when needed
 */

import { 
  Geo,              // Tokyo
  Modak,            // Bangkok
  Corinthia,        // Paris
  Quintessential,   // Rome
  Style_Script,     // Los Angeles
  Russo_One,        // New York
  Bungee,           // Berlin
  Playball,         // London
  Aladin,           // Istanbul
  Gravitas_One,     // Dubai
  Barlow_Condensed  // Hong Kong
} from 'next/font/google'

// Font configurations with optimized settings
const tokyoFont = Geo({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false, // Only load when route is accessed
})

const bangkokFont = Modak({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const parisFont = Corinthia({ 
  weight: '700', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const romeFont = Quintessential({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const laFont = Style_Script({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const nyFont = Russo_One({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const berlinFont = Bungee({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const londonFont = Playball({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const istanbulFont = Aladin({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const dubaiFont = Gravitas_One({ 
  weight: '400', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

const hkFont = Barlow_Condensed({ 
  weight: '800', 
  subsets: ['latin'], 
  variable: '--font-city', 
  display: 'swap',
  preload: false,
})

// City slug to font mapping
const cityFontMap: Record<string, any> = {
  'tokyo': tokyoFont,
  'bangkok': bangkokFont,
  'paris': parisFont,
  'rome': romeFont,
  'los-angeles': laFont,
  'new-york': nyFont,
  'berlin': berlinFont,
  'london': londonFont,
  'istanbul': istanbulFont,
  'dubai': dubaiFont,
  'hong-kong': hkFont,
}

/**
 * Get the font class for a specific city
 * @param citySlug - The city slug (e.g., 'paris', 'tokyo')
 * @returns Font CSS variable class or empty string
 */
export function getCityFont(citySlug: string): string {
  const font = cityFontMap[citySlug]
  return font?.variable || ''
}

/**
 * Get all city slugs that have custom fonts
 */
export function getCityFontSlugs(): string[] {
  return Object.keys(cityFontMap)
}