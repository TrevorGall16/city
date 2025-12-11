/**
 * Core TypeScript Interfaces for City Sheet
 * Following strict schema from 05_Data_API
 */

export interface City {
  id: string
  slug: string
  name: string
  country: string
  country_code: string
  hero_image: string
  intro_vibe: string
  general_info: {
    population: string
    is_capital: boolean
    description: string
  }
  stats: {
    currency: string
    plug_type: string
  }
  weather_breakdown: Array<{
    id: number
    name: string
    temp: string
    vibe: string
    pros: string[]
    cons: string[]
    clothing: string
  }>
  culture: {
    etiquette_tips: string[]
    essential_phrases: Array<{
      src: string
      local: string
      phonetic: string
    }>
  }
  neighborhoods: Array<{
    name: string
    vibe: string
    description: string
    highlights: string[]
  }>
  logistics: Array<{
    id: string
    slug: string
    title: string
    icon: string
    summary: string
    details: string[]
  }>
  must_eat: Place[]
  must_see: Array<{
    title: string
    id: string
    description?: string
    items: Place[]
  }>
  affiliate_products?: Array<{
    id: string
    title: string
    image: string
    reason: string
    amazon_url: string
    category?: string
  }>
}

export interface Place {
  id: string
  slug: string
  name_en: string
  name_local: string
  category: string // Now supports dynamic categories like 'Museum', 'Temple', 'Food', etc.
  description: string
  image: string
  is_generic_staple: boolean
  geo?: {
    lat: number
    lng: number
  }
}

// Component Prop Interfaces (from 03_UI)

export interface CityCardProps {
  name: string
  country: string
  image: string
  slug: string
  priority?: boolean
}

export interface PlaceCardProps {
  name_en: string
  name_local: string
  image: string
  category: 'food' | 'sight'
  slug: string
  citySlug: string
}

export interface TranslationHookProps {
  text: string
  label?: string
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

// Database Types (Supabase)

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

// Search API Response Types

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
