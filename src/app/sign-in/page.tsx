// app/sign-in/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, UserPlus, Send, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Metadata } from 'next'

// Metadata should be set in a separate file if using the App Router
// or defined here if this file is a server component wrapper.
// Since we are using 'use client', we define the page component directly.

export default function SignInPage() {
  const router = useRouter()
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
    
    // Trigger the OAuth sign-in flow
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirect back to the homepage after successful login
        redirectTo: `${window.location.origin}/`,
        // We added the user to the test list, but this setting is generally good
        skipBrowserRedirect: false, 
      },
    })

    if (signInError) {
      setError(signInError.message || 'Google sign-in failed. Please try email.')
    }
    // Note: No need to stop loading here, as the browser redirects on success/fail
  }

// --- 2. HANDLE EMAIL/PASSWORD LOGIN & SIGNUP ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    if (isSigningUp) {
      // SIGN UP LOGIC (Requires email confirmation)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (signUpError) {
        let errorMessage = signUpError.message;
        
        // --- 🚨 CRITICAL FIX: Rate Limit & Existing User Error Handling 🚨 ---
        if (signUpError.message.includes('rate limit')) {
           // Overrides the technical error with a user-friendly instruction
           errorMessage = 'Too many sign-up attempts. Please wait 60 seconds before trying again.'
        } else if (signUpError.message.includes('A user with this email address already exists')) {
          errorMessage = 'An account with this email already exists. Please try logging in or use Google.'
        }
        // --- 🚨 END CRITICAL FIX 🚨 ---
        
        setError(errorMessage)
      } else if (data.user?.identities?.length === 0) {
        // User already exists via OAuth/Magic Link
        setError('An account with this email already exists. Please try logging in or use Google.')
      } else {
        // SUCCESS PATH
        setSuccessMessage('Success! Please check your email inbox to confirm your account before logging in. If you don\'t see it, check your spam/junk folder.')
        setIsSigningUp(false); // Switch to login view after successful signup prompt
      }

    } else {
      // LOGIN LOGIC
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Handle common unconfirmed user error
        if (signInError.message.includes('Email not confirmed')) {
          setError('Email not confirmed. Please check your inbox for the confirmation link.')
        } else {
          setError(signInError.message || 'Login failed. Check your email and password.')
        }
      } else {
        // Success: Redirect to the user's saved page or home
        router.push('/')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      {/* Auth Card Container - Simple Glass Effect */}
      <div className="w-full max-w-md p-8 sm:p-10 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 relative z-10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">
          {isSigningUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-slate-400 mb-8">
          {isSigningUp ? 'Join CityBasic and save your favorite places.' : 'Sign in to access your saved trips.'}
        </p>

  {/* GOOGLE BUTTON */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors disabled:opacity-50 mb-6"
        >
          {/* Manually added Google Icon SVG since Lucide doesn't have it */}
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
          <span className="flex-shrink mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        {/* ERROR & SUCCESS MESSAGES */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-800/20 text-red-400 rounded-lg mb-4 text-sm">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-green-800/20 text-green-400 rounded-lg mb-4 text-sm">
            <Send className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* EMAIL/PASSWORD FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {isSigningUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            {loading 
              ? 'Loading...' 
              : isSigningUp 
              ? 'Sign Up & Send Confirmation' 
              : 'Sign In'
            }
          </button>
        </form>
        
        {/* Switch Link */}
        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsSigningUp(!isSigningUp)}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {isSigningUp 
              ? 'Already have an account? Sign In' 
              : 'Need an account? Sign Up'
            }
          </button>
        </div>
      
        {/* Forgot Password Link */}
        {!isSigningUp && (
          <div className="mt-3 text-center text-xs">
            <Link
              href="/forgot-password" 
              className="text-slate-500 hover:text-slate-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
