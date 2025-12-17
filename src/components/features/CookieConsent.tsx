'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted
    const consent = localStorage.getItem('CityBasic_cookie_consent')
    if (!consent) {
      // Small delay to not annoy user immediately
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('CityBasic_cookie_consent', 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-slate-900/95 text-slate-200 backdrop-blur border-t border-slate-700 shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p className="font-semibold text-white mb-1">We respect your privacy</p>
          <p className="opacity-90">
            We use cookies to improve your experience and show personalized ads. 
            By continuing, you agree to our privacy policy.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-1 md:flex-none px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="flex-1 md:flex-none px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}