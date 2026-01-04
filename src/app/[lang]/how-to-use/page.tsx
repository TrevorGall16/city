/**
 * How to Use Page
 * Simplified guide focusing on core user journey
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How to Use CityBasic',
  description: 'Simple guide to planning your trip with CityBasic.',
}

export default function HowToUsePage() {
  return (
    <InfoPageLayout
      title="How to Use CityBasic"
      lastUpdated="2025-12-15"
    >
      {/* Intro */}
      <div className="mb-12 max-w-2xl">
        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          CityBasic is designed to be your instant travel companion. No fluff, just the curated essentials. Here is how to plan your perfect trip in minutes.
        </p>
      </div>

      {/* The 4-Step Guide - Grid Layout for better readability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        
        {/* Step 1 */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            1. Find Your City
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            Use our <strong>Interactive Map</strong> on the homepage or the search bar to find your destination. We cover the top spots in Europe, Asia, and the Americas.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
          <div className="text-4xl mb-4">👀</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            2. Explore the Essentials
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            Skip the tourist traps. Check our <strong>Must See</strong> for landmarks and <strong>Must Eat</strong> for curated local food recommendations, filtered by price and vibe.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            3. Create an Account
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Sign up for free</Link> to unlock personal features. It takes seconds and syncs your data across all your devices.
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
          <div className="text-4xl mb-4">❤️</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            4. Save Your Favorites
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            See a restaurant you love? Click the <strong>Save</strong> icon. Build your own itinerary and access your saved places anytime, even on the go.
          </p>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="border-t border-slate-200 dark:border-white/10 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Pro Tips
        </h2>
        
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-1 rounded">📱</span>
            <div>
              <strong className="block text-slate-900 dark:text-white">Go Offline</strong>
              <span className="text-slate-600 dark:text-slate-400">Add CityBasic to your phone's home screen. It works like an app and loads pages offline.</span>
            </div>
          </li>
          
          <li className="flex items-start gap-3">
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-1 rounded">🗣️</span>
            <div>
              <strong className="block text-slate-900 dark:text-white">Instant Translation</strong>
              <span className="text-slate-600 dark:text-slate-400">Click on local dishes or addresses to see the local spelling and pronunciation instantly.</span>
            </div>
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-colors"
        >
          Start Exploring Now
        </Link>
      </div>

    </InfoPageLayout>
  )
}