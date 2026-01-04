/**
 * Corrections Page
 * Simple, direct feedback loop
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Submit a Correction - CityBasic',
  description: 'Help keep CityBasic accurate. Report outdated info directly to the developer.',
}

export default function CorrectionsPage() {
  return (
    <InfoPageLayout
      title="Submit a Correction"
      lastUpdated="2025-12-15"
    >
      {/* The Honest Intro */}
      <div className="mb-12 max-w-2xl">
        <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
          Since I'm just one person managing all these cities, things can change without me noticing. A restaurant might close, or a tip might be wrong.
          <br /><br />
          If you spot an error, I would really appreciate your help fixing it.
        </p>
      </div>

      {/* Two Simple Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        
        {/* Option 1: Email */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col items-start">
          <div className="text-4xl mb-4">✉️</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Email Me Directly
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
            The fastest way to reach me. Feel free to send screenshots or just a quick note about what's wrong.
          </p>
          <a 
            href="mailto:efwfew1611@gmail.com?subject=Correction for CityBasic" 
            className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            efwfew1611@gmail.com
          </a>
        </div>

        {/* Option 2: Comments */}
        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10 flex flex-col items-start">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Leave a Comment
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
            You can post a comment directly at the bottom of any City page. I read every single one and will update the main content based on your feedback.
          </p>
          <Link 
            href="/" 
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Find a city →
          </Link>
        </div>

      </div>

      {/* Closing Note */}
      <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800/30">
        <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
          <strong>Note:</strong> I usually process corrections within 24-48 hours. Thank you for helping make this tool better for everyone!
        </p>
      </div>

    </InfoPageLayout>
  )
}