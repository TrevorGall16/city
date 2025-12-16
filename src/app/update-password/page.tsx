// src/app/update-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)

  // 1. Check if the user is authenticated from the reset link token on load
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      // If the user is authenticated (meaning the URL token was valid), stop loading.
      if (data.session) {
        setIsVerifying(false)
      } else {
        // If the session isn't immediately found, assume error or wait for the user to enter data
        // For simplicity, we assume the user landed here correctly via the email link
        setIsVerifying(false) 
      }
    }
    checkAuth()
  }, [supabase.auth])


  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    // 2. Update the user's password using the session token from the URL
const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    })

    if (updateError) {
      // 🚨 NEW CODE: Customize the error message 🚨
      if (updateError.message.includes("Password should contain")) {
         setError("Password must contain at least one letter and one number.")
      } else {
         setError(updateError.message || 'Failed to update password.')
      }
      // ---------------------------------------------
      
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Verifying link...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative z-10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Update Password
        </h1>
        <p className="text-slate-400 mb-8">
          Enter your new, secure password below.
        </p>

        {/* Success / Error State */}
        {success ? (
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-white mb-4">
              Success! Your password has been updated.
            </p>
            <p className="text-sm text-slate-400">
              You can now use your new password to sign in.
            </p>
            <Link 
              href="/sign-in" 
              className="mt-6 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-800/20 text-red-400 rounded-lg mb-4 text-sm">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="min 6 characters"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="re-enter password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}