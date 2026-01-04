/**
 * 🛰️ MASTER AI: SIGN-IN & AUTH HUB (V8.0 - LOCALIZED & PRESERVED)
 * ✅ Fixed: Resolved 'lang' missing prop error for Next.js 16.
 * ✅ Content: 100% original Supabase Auth, Rate-Limit logic, and UI preserved.
 * ✅ Routing: Localized Google OAuth redirects and internal links.
 */

'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation' // 🎯 Added useParams
import { Mail, Lock, LogIn, UserPlus, Send, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignInPage() {
  const router = useRouter()
  const params = useParams() // 🎯 STEP 1: Get lang from URL
  const lang = (params?.lang as string) || 'en'
  
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // --- 1. HANDLE GOOGLE LOGIN (OAUTH) ---
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError(null)
    
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // 🎯 STEP 2: Return to localized home (e.g., /fr/ or /hi/)
        redirectTo: `${window.location.origin}/${lang}/`,
        skipBrowserRedirect: false, 
      },
    })

    if (signInError) {
      setError(signInError.message || 'Google sign-in failed. Please try email.')
    }
  }

// --- 2. HANDLE EMAIL/PASSWORD LOGIN & SIGNUP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (isSigningUp) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        let errorMessage = signUpError.message;
        
        // --- 🚨 CRITICAL FIX: Rate Limit & Existing User Logic PRESERVED ---
        if (signUpError.message.includes('rate limit')) {
           errorMessage = 'Too many sign-up attempts. Please wait 60 seconds before trying again.'
        } else if (signUpError.message.includes('A user with this email address already exists')) {
          errorMessage = 'An account with this email already exists. Please try logging in or use Google.'
        }
        setError(errorMessage)
      } else if (data.user?.identities?.length === 0) {
        setError('An account with this email already exists. Please try logging in or use Google.')
      } else {
        setSuccessMessage('Success! Please check your email inbox to confirm your account before logging in.')
        setIsSigningUp(false);
      }

    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        if (signInError.message.includes('Email not confirmed')) {
          setError('Email not confirmed. Please check your inbox for the confirmation link.')
        } else {
          setError(signInError.message || 'Login failed. Check your email and password.')
        }
      } else {
        // 🎯 STEP 3: Localized home redirect
        router.push(`/${lang}/`)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      {/* Auth Card Container */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative z-10">
        
        <h1 className="text-3xl font-bold text-white mb-2 uppercase tracking-tighter italic">
          {isSigningUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-400 mb-8">
          {isSigningUp ? 'Join CityBasic and save your favorite places.' : 'Sign in to access your saved trips.'}
        </p>

        {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3 rounded-lg font-bold hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? 'Processing...' : 'Continue with Google'}
        </button>

        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-black uppercase">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-800/20 text-red-400 rounded-lg mb-4 text-xs font-bold border border-red-500/20">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-green-800/20 text-green-400 rounded-lg mb-4 text-xs font-bold border border-green-500/20">
            <Send className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase text-slate-400 mb-2">Email</label>
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

          <div>
            <label htmlFor="password" className="block text-xs font-black uppercase text-slate-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                placeholder="min 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSigningUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {loading ? 'Processing...' : isSigningUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </button>
        </div>
      
        {!isSigningUp && (
          <div className="mt-4 text-center">
            <Link
              href={`/${lang}/forgot-password`} // 🎯 STEP 4: Localized forgot password link
              className="text-slate-500 hover:text-slate-400 text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}