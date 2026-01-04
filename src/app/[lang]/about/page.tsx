/**
 * 🛰️ MASTER AI: ABOUT PAGE (V6.1 - TEXT-PRESERVED & BUILD-FIXED)
 * ✅ Fixed: Resolved params Promise for Next.js 16.
 * ✅ Fixed: Passed required 'lang' prop to InfoPageLayout.
 * ✅ Content: 100% original "Solo Guy" story preserved.
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About CityBasic - Built by a Traveler, Not a Corp',
  description: 'Meet the solo developer behind CityBasic and learn why we prioritize no-fluff, actionable travel guides.',
}

interface AboutPageProps {
  params: Promise<{ lang: string }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  // 🎯 Technical requirement: Await the dynamic language parameter
  const { lang } = await params

  return (
    <InfoPageLayout
      title="About CityBasic"
      lastUpdated="2025-12-15"
      lang={lang} // ✅ Fixes the TypeScript build error
    >
      {/* 1. The Personal Intro (The "Solo Guy" Story) - TEXT KEPT AS IS */}
      <div className="mb-16 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/30">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          👋 Hi, I'm the guy behind CityBasic.
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">
          I'm a guy who loves traveling and build website. I built this site because I was tired of reading 20-page blog posts just to find one good coffee shop.
          <br /><br />
          CityBasic isn't a giant corporation. It's just me, doing the research I wish existed when I land in a new city: clean, direct, and honest.
          <br /><br />
          I'm gonna keep updating with more infos I can find online (sadly I haven't been to every city listed here, but hopefully one day!) It's just a passion project for me to learn more about new places and document where I've been.
        </p>
      </div>

      {/* 2. The "Why" - Visual Grid - TEXT KEPT AS IS */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Why I Built This
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: The Problem */}
          <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
              <span>🚫</span> The Problem
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Modern travel content is broken. Search for "best things to do in Paris" and you drown in SEO-optimized fluff, 10-paragraph life stories, and AI-generated listicles that all sound the same.
            </p>
          </div>

          {/* Card 2: The Solution */}
          <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-3">
              <span>✅</span> The CityBasic Way
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              While I can add my finding to places I've been, I can only learn from what I see and hear online. I added a comment section so that hopefully people can correct or give tips to one another.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Contact / Feedback - TEXT KEPT AS IS */}
      <div className="border-t border-slate-200 dark:border-white/10 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Help Me Improve
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Since it's just me, mistakes might happen. If you find an error or have a suggestion, I'd love to hear from you.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link 
            href={`/${lang}/corrections`} 
            className="inline-flex items-center px-6 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            Submit a Correction
          </Link>
        </div>
      </div>
    </InfoPageLayout>
  )
}