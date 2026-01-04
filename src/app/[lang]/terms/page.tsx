/**
 * 🛰️ MASTER AI: TERMS PAGE (GOLDEN MASTER V7.5)
 * ✅ Fixed: Resolved "Property 'lang' is missing" build error.
 * ✅ Fixed: Implemented Next.js 16 async params pattern.
 * ✅ Content: Preserved your original terms text.
 */

import { InfoPageLayout } from '@/components/layout/InfoPageLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - CityBasic',
  description: 'The rules of the road for using CityBasic.',
}

// 🎯 Technical requirement: Define the dynamic params interface
interface TermsPageProps {
  params: Promise<{ lang: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
  // 🎯 Technical requirement: Await params to extract the language segment
  const { lang } = await params

  return (
    <InfoPageLayout 
      title="Terms of Service" 
      lastUpdated="2025-12-15"
      lang={lang} // ✅ This fixes the TypeScript 'missing property' error
    >
      <div className="prose dark:prose-invert max-w-none">
        <section>
          <h2>Acceptance of Terms</h2>
          <p>
            By using CityBasic, you agree to our terms. We provide travel information "as is" 
            and are not responsible for changes in prices, opening hours, or local laws.
          </p>
          <p>You agree not to misuse the service or scrape our data.</p>
        </section>

        <section className="mt-10">
          <h2>User Responsibility</h2>
          <p>
            While we strive for accuracy, travel conditions can change rapidly. Always verify 
            critical information (like visa requirements or transport schedules) with official 
            sources before your trip.
          </p>
        </section>

        <section className="mt-10">
          <h2>Accounts and Security</h2>
          <p>
            If you create an account, you are responsible for maintaining the security of 
            your password. We use Supabase to ensure your data is stored using industry-standard 
            security protocols.
          </p>
        </section>
      </div>
    </InfoPageLayout>
  )
}