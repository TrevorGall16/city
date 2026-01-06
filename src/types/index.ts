/**
 * 🛰️ MASTER AI: CORE TYPES (V2.0 - CRASH PROOF)
 * ✅ Fixed: intro_vibe & itinerary now support { description: "..." } objects for localized data.
 * ✅ Fixed: Place description made flexible to prevent TypeScript errors.
 * ✅ Preserved: All DB types, SEO features, and Dashboard props kept intact.
 */

// --- 1. DATA TYPES (JSON CONTENT) ---

export interface Place {
  id: string
  slug: string
  name_en: string
  name_local?: string // Made optional to prevent errors if missing
  category: string // Supports 'food' | 'sight' | dynamic strings
  price_level?: string
  
  // 🛡️ MASTER AI FIX: Flexible description to handle inconsistent JSON shapes
  description: string | { 
    short?: string; 
    description?: string; // Added to catch generic 'description' keys
    history?: string; 
    insider_tip?: string; 
    price_level?: string; 
    duration?: string; 
    best_time?: string;
    good_for?: string[];
  } 
  
  image: string
  is_generic_staple?: boolean
  geo?: {
    lat: number
    lng: number
  }
}

export interface WeatherMonth {
  id: string | number
  name: string
  temp: string        // Keeps original string format "15°C"
  condition: string   // For the Icon (e.g., "Sunny")
  rain_days?: number  // Optional, in case some cities miss it
  vibe?: string
  clothing?: string   // ✅ Restored
  pros?: string[]     // ✅ Restored
  cons?: string[]     // ✅ Restored
}

export interface Neighborhood {
  name: string
  vibe: string
  description: string
  image: string
  highlights: string[]
}

export interface AffiliateProduct {
  id: string
  title: string
  image: string
  reason: string
  amazon_url: string
  category: string
}

export interface ItineraryStop {
  time: string
  title: string
  // 🛡️ MASTER AI FIX: Support localized object descriptions
  description: string | {
    short?: string;
    long?: string;
    description?: string;
  }
  image?: string
  ticket_link?: string
}

export interface LogisticsTopic {
  id: string
  slug: string
  title: string
  icon: string
  summary: string
  details: string[] // Array of strings (can include "Label: Content" format)
}

export interface City {
  id: string
  slug: string
  name: string
  country: string
  country_code: string
  hero_image: string

  // 🛡️ MASTER AI FIX: Allows string OR object (Fixes the "Red Line" error)
  intro_vibe: string | {
    short?: string;
    long?: string;
    description?: string;
  }

  // 🎯 DASHBOARD PROPS
  best_time_to_visit?: string
  currency?: string
  language_primary?: string

  // 🗺️ GEO COORDINATES (For SEO/Maps)
  lat?: number
  lng?: number
  region?: string     

  general_info: {
    population: string
    is_capital: boolean
    description: string
  }
  
  stats: {
    currency: string
    plug_type: string
    main_language?: string 
  }
  
  // Updated arrays to use specific interfaces
  weather_breakdown: WeatherMonth[]
  neighborhoods: Neighborhood[]
  
  // ✅ Itinerary Support
  itinerary?: ItineraryStop[]
  
  logistics: LogisticsTopic[]
  
  must_eat: Place[]
  must_see: Array<{
    title: string
    id: string
    items: Place[]
  }>
  
  culture: {
    etiquette_tips: string[]
    essential_phrases: Array<{
      src: string
      local: string
      phonetic: string
    }>
  }
  
  affiliate_products?: AffiliateProduct[]
}

// --- 2. COMPONENT PROPS (UI) ---

export interface CityCardProps {
  name: string
  country: string
  image: string
  slug: string
  priority?: boolean
}

export interface PlaceCardProps {
  place: Place
  citySlug: string
}

export interface TranslationHookProps {
  text: string
  placeName?: string // Added for context
  className?: string
}

export interface AdContainerProps {
  slot: 'header' | 'grid' | 'sidebar' | 'footer'
  className?: string
}

export interface CommentThreadProps {
  placeSlug?: string
  citySlug: string
}

// --- 3. DATABASE TYPES (SUPABASE) ---

export interface Comment {
  id: string
  user_id: string
  city_slug: string
  place_slug: string | null
  parent_id: string | null
  content: string
  created_at: string
  profiles?: {
    display_name: string | null
    avatar_url: string | null
  }
  vote_count?: number
}

export interface Vote {
  id: string
  user_id: string
  comment_id: string
  value: 1 | -1
  created_at: string
}

export interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  created_at: string
}

// --- 4. API RESPONSES ---

export interface SearchResponse {
  cities: Array<{
    name: string
    slug: string
    country: string
  }>
  places: Array<{
    name_en: string
    citySlug: string
    placeSlug: string
    category: string
  }>
}