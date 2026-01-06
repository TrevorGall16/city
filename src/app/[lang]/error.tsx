'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 🎯 MASTER AI: FIX POINT 10 (Log the error)
    // Now we won't have "Silent Errors" anymore. We will see them here.
    console.error('🚨 APPLICATION CRASH:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
        Something went wrong!
      </h2>
      
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 leading-relaxed">
        We encountered an unexpected error. Don't worry, your data is safe. 
        It might be a temporary glitch.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Try Again Button */}
        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>

        {/* Go Home Button */}
        <Link 
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
        >
          <Home className="w-4 h-4" />
          Go Home
        </Link>
      </div>

      {/* Dev-only error details (Hidden in production usually, but helpful for you) */}
      <div className="mt-12 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg text-left max-w-lg w-full overflow-hidden">
        <p className="text-xs font-mono text-slate-500 mb-2 uppercase tracking-widest">Error Details:</p>
        <code className="text-xs font-mono text-red-600 dark:text-red-400 block break-words">
          {error.message || "Unknown Error"}
        </code>
      </div>
    </div>
  )
}