/**
 * Public User Profile Page
 * Displays user information: Avatar, Name, Bio, Joined Date
 * Shows "Edit Profile" button if viewing own profile
 */

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, MapPin, Edit, Heart } from 'lucide-react'
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

  // Check if current user is viewing their own profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  // Fetch saved places (only if viewing own profile or user is logged in)
  let savedPlaces: any[] = []
  if (isOwnProfile) {
    const { data: places } = await supabase
      .from('saved_places')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    savedPlaces = places || []
  }

  // Get country info from country code
  const countryInfo = getCountryInfo(profile.country_code)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
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
          <div className="flex items-start gap-6 flex-col sm:flex-row">
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
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
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
                        Joined {new Date(profile.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button (Only for own profile) */}
                {isOwnProfile && (
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
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
              {isOwnProfile
                ? "You haven't added a bio yet. Click 'Edit Profile' to add one!"
                : "This traveler hasn't added a bio yet."}
            </p>
          </div>
        )}

        {/* Saved Places (Only for own profile) */}
        {isOwnProfile && (
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                Saved Places
              </h2>
              {savedPlaces.length > 0 && (
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {savedPlaces.length} {savedPlaces.length === 1 ? 'place' : 'places'}
                </span>
              )}
            </div>

            {savedPlaces.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 dark:text-slate-400 mb-4">
                  You haven't saved any places yet
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Explore Cities
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedPlaces.map((place) => (
                  <Link
                    key={place.id}
                    href={`/city/${place.city_slug}/${place.place_slug}`}
                    className="group p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {formatPlaceName(place.place_slug)}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                          {formatCityName(place.city_slug)}
                        </p>
                      </div>
                      <Heart className="w-4 h-4 text-red-500 fill-current flex-shrink-0 ml-2" />
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      Saved {new Date(place.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

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

// Helper functions for formatting
function formatPlaceName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatCityName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
