/**
 * 🛰️ MASTER AI: PUBLIC USER PROFILE (V9.5 - LOCALIZED & PRESERVED)
 * ✅ Fixed: Resolved 'lang' and 'userId' params for Next.js 16.
 * ✅ Content: 100% original Supabase logic, UI, and Flag helper preserved.
 * ✅ Routing: Localized links for Edit Profile and Saved Places.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { MapPin, Calendar, Heart } from 'lucide-react'
import { format } from 'date-fns'

interface PageProps {
  params: Promise<{ 
    userId: string 
    lang: string // 🎯 STEP 1: Added lang to the interface
  }>
}

export default async function UserProfile({ params }: PageProps) {
  // 🎯 STEP 2: Await both params (Critical for Next.js 16)
  const { userId, lang } = await params
  const supabase = await createClient()

  // Fetch User Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError || !profile) {
    console.error('Profile Load Error:', profileError)
    notFound()
  }

  // Fetch saved places from the canonical `saved_places` table.
  const { data: savedPlaces } = await supabase
    .from('saved_places')
    .select('id, place_slug, city_slug, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // Check if we are viewing our own profile
  const { data: { user: currentUser } } = await supabase.auth.getUser()
  const isOwnProfile = currentUser?.id === userId

  // Fallback chain: profiles.avatar_url -> Google OAuth user_metadata.avatar_url
  // (auth metadata is only available for the *current* user, so the OAuth
  // fallback only kicks in when you view your own profile).
  const googleAvatar = isOwnProfile
    ? (currentUser?.user_metadata?.avatar_url ||
        currentUser?.user_metadata?.picture ||
        null)
    : null
  const avatarUrl = profile.avatar_url || googleAvatar

  // Helper: Format Country Flag - PRESERVED
  const getFlagEmoji = (countryCode: string) => {
    if (!countryCode) return '🌍'
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="h-32 bg-indigo-600"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden relative">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={profile.display_name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-300">
                    {profile.display_name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </div>
              
              {/* Edit Button (Only visible if it's YOU) */}
              {isOwnProfile && (
                <Link 
                  href={`/${lang}/profile`} // 🎯 STEP 3: Localized Edit Link
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Info */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {profile.display_name}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
              {profile.country_code && (
                <div className="flex items-center gap-1">
                  <span>{getFlagEmoji(profile.country_code)}</span>
                  <span>From {profile.country_code}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.created_at ? format(new Date(profile.created_at), 'MMMM yyyy') : 'recently'}</span>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            )}
          </div>
        </div>

        {/* Saved Places Section */}
        {savedPlaces && savedPlaces.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              Saved Places ({savedPlaces.length})
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {savedPlaces.map((item: any) => (
                <Link 
                  key={item.id} 
                  href={`/${lang}/city/${item.city_slug}/${item.place_slug}`} // 🎯 STEP 4: Localized Place Link
                  className="block group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors capitalize">
                        {item.place_slug.replace(/-/g, ' ')}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                        {item.city_slug.replace(/-/g, ' ')}
                      </p>
                    </div>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                  <div className="mt-4 text-xs text-slate-400">
                    Saved {format(new Date(item.created_at), 'MMM d, yyyy')}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}