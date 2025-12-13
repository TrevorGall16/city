'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface SaveButtonProps {
  placeSlug: string
  citySlug: string
  variant?: 'default' | 'compact'
  showLabel?: boolean
}

export function SaveButton({
  placeSlug,
  citySlug,
  variant = 'default',
  showLabel = true
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // Check auth status and saved status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (!user) {
          setIsLoading(false)
          return
        }

        // Check if place is saved
        const res = await fetch(
          `/api/favorites?placeSlug=${placeSlug}&citySlug=${citySlug}`
        )

        if (res.ok) {
          const data = await res.json()
          setIsSaved(data.isSaved || false)
        }
      } catch (error) {
        console.error('Error checking save status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [placeSlug, citySlug, supabase.auth])

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please log in to save places')
      return
    }

    if (isToggling) return

    // Optimistic UI update
    const previousState = isSaved
    setIsSaved(!isSaved)
    setIsToggling(true)

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeSlug, citySlug }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save')
      }

      // Update with server response
      setIsSaved(data.isSaved)

      toast.success(data.isSaved ? 'Place saved!' : 'Place removed')
    } catch (error) {
      // Revert on error
      setIsSaved(previousState)
      console.error('Toggle save error:', error)
      toast.error('Failed to save place')
    } finally {
      setIsToggling(false)
    }
  }

  if (isLoading) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 ${
          variant === 'compact' ? 'p-2' : 'px-4 py-2'
        } rounded-lg opacity-50 cursor-not-allowed`}
      >
        <Heart className={variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'} />
        {showLabel && variant === 'default' && <span className="text-sm">Save</span>}
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isToggling}
      className={`
        flex items-center gap-2 transition-all duration-200
        ${variant === 'compact' ? 'p-2' : 'px-4 py-2'}
        ${isSaved
          ? 'text-red-500 hover:text-red-600'
          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-400'
        }
        ${variant === 'default' ? 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-md' : ''}
        ${isToggling ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
      `}
      aria-label={isSaved ? 'Remove from saved' : 'Save place'}
    >
      <Heart
        className={`
          ${variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5'}
          ${isSaved ? 'fill-current' : ''}
          transition-transform duration-200
          ${isToggling ? 'animate-pulse' : ''}
        `}
      />
      {showLabel && variant === 'default' && (
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}
