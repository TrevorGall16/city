/**
 * Analytics Hook
 * Following 06_Quality_and_Deployment specification
 *
 * Tracks 5 required events:
 * 1. search_performed
 * 2. place_opened
 * 3. copy_name_local (North Star Metric)
 * 4. comment_posted
 * 5. vote_clicked
 *
 * V1: Uses console.log (mocking GA4)
 * Production: Replace with actual GA4 gtag calls
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Type definitions for events
interface AnalyticsEvents {
  search_performed: { query: string }
  place_opened: { place_name: string; city_slug: string; place_slug: string }
  copy_name_local: { text: string; place_name: string }
  comment_posted: { city_slug: string; place_slug?: string }
  vote_clicked: { value: number; comment_id: string }
  page_view: { route: string }
}

type EventName = keyof AnalyticsEvents
type EventParams<T extends EventName> = AnalyticsEvents[T]

/**
 * Track custom event
 * V1: Logs to console with timestamp and formatted output
 * Production: Replace console.log with gtag('event', ...)
 */
function trackEvent<T extends EventName>(
  eventName: T,
  params: EventParams<T>
) {
  const timestamp = new Date().toISOString()

  // V1: Console logging with nice formatting
  console.log(`📊 Analytics Event: ${eventName}`)
  console.log(`   Time: ${timestamp}`)
  console.log(`   Data:`, params)

  // Production implementation (commented out for V1):
  // if (typeof window !== 'undefined' && (window as any).gtag) {
  //   (window as any).gtag('event', eventName, params)
  // }
}

/**
 * Main Analytics Hook
 * Provides track function and automatic page view tracking
 */
export function useAnalytics() {
  const pathname = usePathname()

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackEvent('page_view', { route: pathname })
    }
  }, [pathname])

  return {
    /**
     * Track search performed
     * Triggered when user searches for cities
     */
    trackSearch: (query: string) => {
      trackEvent('search_performed', { query })
    },

    /**
     * Track place detail page opened
     * Triggered when user navigates to place page
     */
    trackPlaceOpen: (placeName: string, citySlug: string, placeSlug: string) => {
      trackEvent('place_opened', {
        place_name: placeName,
        city_slug: citySlug,
        place_slug: placeSlug,
      })
    },

    /**
     * Track translation hook usage (NORTH STAR METRIC)
     * Triggered when user copies local text to clipboard
     */
    trackCopyLocal: (text: string, placeName: string) => {
      trackEvent('copy_name_local', {
        text,
        place_name: placeName,
      })
    },

    /**
     * Track comment posted
     * Triggered when user successfully posts a comment
     */
    trackCommentPost: (citySlug: string, placeSlug?: string) => {
      trackEvent('comment_posted', {
        city_slug: citySlug,
        place_slug: placeSlug,
      })
    },

    /**
     * Track vote clicked
     * Triggered when user upvotes or downvotes a comment
     */
    trackVote: (value: number, commentId: string) => {
      trackEvent('vote_clicked', {
        value,
        comment_id: commentId,
      })
    },
  }
}
