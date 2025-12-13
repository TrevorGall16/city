/**
 * User Profile Page
 * Protected route - redirects to home if not authenticated
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Toast } from '@/components/ui/Toast'
import { ExternalLink } from 'lucide-react'

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'OTHER', name: 'Other', flag: '🌍' },
]

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/')
        return
      }

      setUserId(user.id)
      setEmail(user.email || '')

      // Load profile from database
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, bio, country_code')
        .eq('id', user.id)
        .single()

      if (profile) {
        setDisplayName(profile.display_name || '')
        setBio(profile.bio || '')
        setCountryCode(profile.country_code || '')
      }

      setLoading(false)
    }

    loadProfile()
  }, [router, supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setToast({ message: 'You must be logged in to save your profile', type: 'error' })
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName,
        bio: bio,
        country_code: countryCode,
        updated_at: new Date().toISOString(),
      })
      .select()

    setSaving(false)

    if (error) {
      console.error('Error saving profile:', error)
      setToast({ message: 'Failed to save profile. Please try again.', type: 'error' })
    } else {
      setToast({ message: 'Profile saved successfully!', type: 'success' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Your Profile</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            {userId && (
              <Link
                href={`/users/${userId}`}
                className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 border border-indigo-300 dark:border-indigo-700 rounded-lg transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">View Public Profile</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Profile Form */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="p-8 space-y-6">
            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Display Name */}
            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
              >
                Display Name *
              </label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={30}
                required
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
                placeholder="Enter your display name"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {displayName.length}/30 characters
              </p>
            </div>

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
              >
                Short Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={200}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us a bit about yourself..."
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {bio.length}/200 characters
              </p>
            </div>

            {/* Country of Origin */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-slate-900 dark:text-slate-50 mb-2"
              >
                Country of Origin
              </label>
              <select
                id="country"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              {countryCode && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-2xl">
                    {COUNTRIES.find((c) => c.code === countryCode)?.flag}
                  </span>
                  <span>
                    Selected: {COUNTRIES.find((c) => c.code === countryCode)?.name}
                  </span>
                </div>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This helps us personalize your experience
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 rounded-b-xl flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
