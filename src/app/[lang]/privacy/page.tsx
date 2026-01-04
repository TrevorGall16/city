/**
 * Privacy Policy Page
 * Professional, readable styling.
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - CityBasic',
  description: 'How CityBasic collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <InfoPageLayout title="Privacy Policy" lastUpdated="2025-12-15">
      
      {/* Intro */}
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          We believe privacy should be simple and transparent. We collect minimal data to make CityBasic work, use Supabase for security, and never sell your personal information.
        </p>

        {/* Section 1 */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            1. Information We Collect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Information You Give Us</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                <li><strong>Account Info:</strong> Email address and password (stored securely via Supabase).</li>
                <li><strong>Profile Data:</strong> Display name and saved favorites.</li>
                <li><strong>Preferences:</strong> Language and display settings.</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Automatic Information</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                <li><strong>Usage Data:</strong> Pages viewed and time spent.</li>
                <li><strong>Device Info:</strong> Browser type and screen size.</li>
                <li><strong>Location:</strong> Approximate city based on IP (not precise GPS).</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            2. How We Use Your Data
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>To provide and maintain the Service (saving your favorites).</li>
            <li>To improve functionality based on how users navigate.</li>
            <li>To show relevant, non-intrusive advertising (Google AdSense).</li>
            <li>To communicate essential updates (we do not send spam marketing).</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            3. Cookies & Advertising
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            We use cookies to keep you logged in and to analyze site traffic.
          </p>
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Google AdSense</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
              We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.
            </p>
            <a 
              href="https://policies.google.com/technologies/ads" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              How Google uses data →
            </a>
          </div>
        </section>

        {/* Section 4 */}
        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
            4. Your Rights
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            You have full control over your data. You can:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
            <li>Request a copy of your data.</li>
            <li>Update your profile information instantly.</li>
            <li><strong>Delete your account</strong> at any time via your profile settings.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-slate-700 dark:text-slate-300">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <a href="mailto:efwfew1611@gmail.com" className="inline-block mt-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            efwfew1611@gmail.com
          </a>
        </section>

      </div>
    </InfoPageLayout>
  )
}