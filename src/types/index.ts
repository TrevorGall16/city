/**
 * Core TypeScript Interfaces for City Sheet
 * Final Merged Version: Preserves DB types + Adds SEO/Itinerary features
 */

// --- 1. DATA TYPES (JSON CONTENT) ---

export interface Place {
  id: string
  slug: string
  name_en: string
  name_local?: string // Made optional to prevent errors if missing
  category: string // Supports 'food' | 'sight' | dynamic strings
  description: string | { 
    short: string; 
    history?: string; 
    insider_tip?: string; 
    price_level?: string; 
    duration?: string; 
    best_time?: string;
    good_for?: string[];
  } // Supports both old string and new object format
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
  description: string
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
  intro_vibe: string
  
  // 🎯 ADD THESE FOR THE DASHBOARD
  best_time_to_visit?: string   // ✅ Fixes AtAGlanceDashboard error
  currency?: string             // ✅ Added for premium logistics
  language_primary?: string     // ✅ Added for premium logistics

  general_info: {
    population: string
    is_capital: boolean
    description: string
  }
  
  stats: {
    currency: string
    plug_type: string
    main_language?: string // ✅ Add this to fix the red error in the Dashboard
  }
  
  // Updated arrays to use specific interfaces
  weather_breakdown: WeatherMonth[]
  neighborhoods: Neighborhood[]
  
  // ✅ NEW: Itinerary Support
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