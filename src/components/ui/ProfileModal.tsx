'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentName?: string | null
}

export function ProfileModal({ isOpen, onClose, currentName }: ProfileModalProps) {
  const router = useRouter()
  const [displayName, setDisplayName] = useState(currentName || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      setDisplayName(currentName || '')
      setError('')
      setSuccess(false)
    }
  }, [isOpen, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          display_name: displayName,
          avatar_url: user.user_metadata?.avatar_url
        }, { onConflict: 'id' })

      if (upsertError) throw upsertError

      setSuccess(true)
      setTimeout(() => {
        onClose()
        router.refresh() // Refresh to show new name in header without reload
      }, 1000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    // FIX: Centered Fixed Position
    <div className="fixed top-0 left-0 w-screen h-screen z-[100] flex items-center justify-center pointer-events-auto">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-2">Edit Profile</h2>
        <p className="text-slate-600 mb-6">Choose a display name for your comments.</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg text-center font-medium">
            Profile Updated!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={30}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="e.g. ParisLover99"
              />
              <p className="text-xs text-slate-400 mt-1 text-right">{displayName.length}/30</p>
            </div>

            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}