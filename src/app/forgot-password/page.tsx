// src/app/forgot-password/page.tsx
'use client'

import { useState } from 'react'
import { Mail, Send, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    if (!email) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }

    // Supabase will send a Magic Link to this email.
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      // Directs the user to the second page of the flow: /update-password
      redirectTo: `${siteUrl}/update-password`,
    })

    if (resetError) {
      // Supabase is intentionally vague on this error to prevent fishing attacks.
      // We must tell the user it failed without giving away too much information.
      console.error("SUPABASE ERROR:", resetError)
      setError('Could not process request. Please check the email and try again later.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative z-10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          Forgot Password
        </h1>
        <p className="text-slate-400 mb-8">
          Enter your email to receive a password reset link.
        </p>

        {/* Success Message */}
        {success ? (
          <div className="text-center">
            <Send className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-white mb-4">
              Password reset email sent!
            </p>
            <p className="text-sm text-slate-400">
              Please check your inbox (and spam folder) for a link to update your password.
            </p>
            <Link 
              href="/sign-in" 
              className="mt-6 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-800/20 text-red-400 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>

            <Link 
              href="/sign-in" 
              className="mt-6 block text-center text-sm text-slate-500 hover:text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1 inline-block" />
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}