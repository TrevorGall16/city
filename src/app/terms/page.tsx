import { InfoPageLayout } from '@/components/layout/InfoPageLayout'

export default function TermsPage() {
  return (
    <InfoPageLayout title="Terms of Service" lastUpdated="2025-12-15">
      <div className="prose dark:prose-invert">
        <p>By using CitySheet, you agree to our terms. We provide travel information "as is" and are not responsible for changes in prices, opening hours, or local laws.</p>
        <p>You agree not to misuse the service or scrape our data.</p>
      </div>
    </InfoPageLayout>
  )
}