'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Loader2, Lock, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfileForm() {
  const supabase = createClient()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // --- 1. PROFILE STATE ---
  const [formData, setFormData] = useState({
    full_name: '',
    website: '',
    avatar_url: '',
  })
  const [isNameLocked, setIsNameLocked] = useState(false)

  // --- 2. PASSWORD STATE ---
  const [newPassword, setNewPassword] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          const name = user.user_metadata?.full_name || ''
          
          setFormData({
            full_name: name,
            website: user.user_metadata?.website || '',
            avatar_url: user.user_metadata?.avatar_url || '',
          })

          if (name && name.trim() !== '') {
            setIsNameLocked(true)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    getProfile()
  }, [supabase])

  // --- HANDLE PROFILE UPDATE ---
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          website: formData.website,
        }
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      if (formData.full_name) setIsNameLocked(true)
      router.refresh()
    } catch (error) {
      console.error(error)
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  // --- HANDLE PASSWORD UPDATE ---
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setPasswordMessage('')

    if (newPassword.length < 6) {
        setPasswordMessage('Password must be at least 6 characters')
        setSaving(false)
        return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      setPasswordMessage('Success! Password changed.')
      setNewPassword('')
    } catch (error: any) {
      setPasswordMessage(error.message || 'Error updating password')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-600" /></div>
  }

  return (
    <div className="max-w-md mx-auto space-y-8">
      
      {/* --- PROFILE INFO --- */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Profile</h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Display Name
            </label>
            <div className="relative">
              <input
                id="fullName"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                disabled={isNameLocked} 
                className={`
                  w-full pl-10 pr-4 py-2.5 rounded-xl border transition-colors
                  ${isNameLocked 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                    : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  }
                `}
                placeholder="e.g. Alex Traveler"
              />
              {isNameLocked ? (
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              ) : (
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              )}
            </div>
            {isNameLocked && (
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Name cannot be changed once set.
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Website (Optional)
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="https://..."
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* --- PASSWORD CHANGE --- */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-slate-900 dark:text-white">
          <KeyRound className="w-5 h-5" />
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          {passwordMessage && (
            <p className={`text-sm ${passwordMessage.includes('Success') ? 'text-green-600' : 'text-red-500'}`}>
              {passwordMessage}
            </p>
          )}

          <button 
            type="submit"
            disabled={saving || !newPassword}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}