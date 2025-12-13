/**
 * Public User Profile Page
 * Displays user information: Avatar, Name, Bio, Country, Member Since
 * Does NOT show private information like email or comment history
 */

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Home, MapPin, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    userId: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { userId } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio')
    .eq('id', userId)
    .single()

  if (!profile) {
    return {
      title: 'User Not Found - CitySheet',
    }
  }

  return {
    title: `${profile.display_name || 'Traveler'} - CitySheet`,
    description: profile.bio || `View ${profile.display_name || 'this traveler'}'s public profile on CitySheet`,
    openGraph: {
      title: `${profile.display_name || 'Traveler'} - CitySheet`,
      description: profile.bio || 'CitySheet traveler profile',
      type: 'profile',
    },
  }
}

export default async function UserProfilePage({ params }: PageProps) {
  const { userId } = await params
const supabase = await createClient()

  // Fetch public profile information
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, bio, country_code, created_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Get country name and flag from country code
  const countryInfo = getCountryInfo(profile.country_code)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-100">
              {profile.display_name || 'Traveler'}
            </span>
          </nav>

          {/* Profile Header */}
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || 'User avatar'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {(profile.display_name?.[0] || '?').toUpperCase()}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                {profile.display_name || 'Traveler'}
              </h1>

              <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                {/* Country */}
                {countryInfo && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {countryInfo.flag} {countryInfo.name}
                    </span>
                  </div>
                )}

                {/* Member Since */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since {new Date(profile.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-12">
        {/* Bio */}
        {profile.bio ? (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-3">
              About
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
            <p className="text-slate-500 dark:text-slate-400 italic">
              This traveler hasn't added a bio yet.
            </p>
          </div>
        )}

        {/* Future: Recent Comments Section */}
        {/*
        <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
            Recent Comments
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm italic">
            Comment history coming soon!
          </p>
        </div>
        */}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            Back to CitySheet
          </Link>
        </div>
      </div>
    </div>
  )
}

// Helper function to get country name and flag emoji from country code
function getCountryInfo(countryCode: string | null): { name: string; flag: string } | null {
  if (!countryCode) return null

  // Common country codes to names mapping
  const countries: { [key: string]: string } = {
    US: 'United States',
    GB: 'United Kingdom',
    CA: 'Canada',
    AU: 'Australia',
    DE: 'Germany',
    FR: 'France',
    ES: 'Spain',
    IT: 'Italy',
    JP: 'Japan',
    CN: 'China',
    IN: 'India',
    BR: 'Brazil',
    MX: 'Mexico',
    NL: 'Netherlands',
    SE: 'Sweden',
    NO: 'Norway',
    DK: 'Denmark',
    FI: 'Finland',
    PL: 'Poland',
    PT: 'Portugal',
    GR: 'Greece',
    TR: 'Turkey',
    RU: 'Russia',
    KR: 'South Korea',
    TH: 'Thailand',
    VN: 'Vietnam',
    SG: 'Singapore',
    NZ: 'New Zealand',
    IE: 'Ireland',
    CH: 'Switzerland',
    AT: 'Austria',
    BE: 'Belgium',
    CZ: 'Czech Republic',
    AR: 'Argentina',
    CL: 'Chile',
    CO: 'Colombia',
  }

  const code = countryCode.toUpperCase()
  const name = countries[code] || code

  // Convert country code to flag emoji
  // Flag emoji is created by combining regional indicator symbols
  const flag = code
    .split('')
    .map((char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    .join('')

  return { name, flag }
}
