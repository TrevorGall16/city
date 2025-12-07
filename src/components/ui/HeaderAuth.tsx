'use client'

/**
 * HeaderAuth Component
 * Displays login button or user avatar in header
 */

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { LoginModal } from './LoginModal'
import { ProfileModal } from './ProfileModal'
import { ThemeToggle } from './ThemeToggle'
import { User, LogOut, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function HeaderAuth() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [displayName, setDisplayName] = useState<string | null>(null)

  // Load display name from profiles table
  useEffect(() => {
    const loadDisplayName = async () => {
      if (!user) {
        setDisplayName(null)
        return
      }

      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()

      if (data?.display_name) {
        setDisplayName(data.display_name)
      }
    }

    loadDisplayName()
  }, [user])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowUserMenu(false)
  }

  const handleProfileModalClose = () => {
    setShowProfileModal(false)
    // Reload display name after profile update
    if (user) {
      const supabase = createClient()
      supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.display_name) {
            setDisplayName(data.display_name)
          }
        })
    }
  }

  if (!user) {
    return (
      <>
        <ThemeToggle />
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          Log In
        </button>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="relative flex items-center gap-2">
      <ThemeToggle />
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={displayName || user.email || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : displayName ? (
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {displayName.charAt(0).toUpperCase()}
            </span>
          ) : (
            <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          )}
        </div>
      </button>

      {/* User dropdown menu */}
      {showUserMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowUserMenu(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-40">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {displayName || 'No display name set'}
              </p>
            </div>

            <button
              onClick={() => {
                setShowUserMenu(false)
                setShowProfileModal(true)
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile Settings
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}

      {/* Profile Modal */}
      <ProfileModal isOpen={showProfileModal} onClose={handleProfileModalClose} />
    </div>
  )
}
