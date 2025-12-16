import { InfoPageLayout } from '@/components/layout/InfoPageLayout' // Ensure this import is correct

export default function ContactPage() {
  return (
    // ✅ FIX: Added the required lastUpdated prop
    <InfoPageLayout title="Contact Us" lastUpdated="2025-01-01">
      <div className="max-w-2xl">
        <p className="text-lg mb-6">Have a correction for a city? Want to suggest a new destination? We'd love to hear from you.</p>
        
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="mb-4">
            <strong>Email:</strong> <a href="mailto:hello@citybasic.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">hello@citybasic.com</a>
          </p>
          <p>
            We usually respond within 24-48 hours.
          </p>
        </div>
      </div>
    </InfoPageLayout>
  )
}