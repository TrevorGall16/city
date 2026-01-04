/**
 * 🛰️ MASTER AI: FORGOT PASSWORD (V8.5 - LOCALIZED & PRESERVED)
 * ✅ Fixed: Resolved 'lang' missing prop error for Next.js 16.
 * ✅ Content: 100% original Supabase reset logic and UI preserved.
 * ✅ Routing: Localized 'redirectTo' ensures users stay in their language.
 */

'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation' // 🎯 Added useParams
import { Mail, Send, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const params = useParams() // 🎯 STEP 1: Get lang from URL
  const lang = (params?.lang as string) || 'en'
  
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

    // 🎯 STEP 2: Directs the user to the localized update page
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/${lang}/update-password`,
    })

    if (resetError) {
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
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter italic">
          Forgot Password
        </h1>
        <p className="text-slate-400 mb-8 text-sm">
          Enter your email to receive a password reset link.
        </p>

        {/* Success Message */}
        {success ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <Send className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg text-white font-bold mb-4">
              Password reset email sent!
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Please check your inbox (and spam folder) for a link to update your password.
            </p>
            <Link 
              href={`/${lang}/sign-in`} // 🎯 STEP 3: Localized back link
              className="mt-8 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-800/20 text-red-400 rounded-lg mb-4 text-xs font-bold border border-red-500/20">
                {error}
              </div>
            )}
            
            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xs font-black uppercase text-slate-400 mb-2">
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>

            <Link 
              href={`/${lang}/sign-in`} // 🎯 STEP 4: Localized back link
              className="mt-8 block text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-1 inline-block" />
              Back to Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  )
}