'use client'

/**
 * HeaderAuth Component
 * Displays login button or user avatar in header
 */

import { useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { LoginModal } from './LoginModal'
import { User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function HeaderAuth() {
  const { user } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowUserMenu(false)
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Log In
        </button>
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          {user.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt={user.email || 'User'}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-indigo-600" />
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
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-40">
            <div className="px-4 py-3 border-b border-slate-200">
              <p className="text-sm font-medium text-slate-900 truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {user.user_metadata?.display_name || 'User'}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
