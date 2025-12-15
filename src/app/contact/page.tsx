import { InfoPageLayout } from '@/components/layout/InfoPageLayout'

export default function ContactPage() {
  return (
    <InfoPageLayout title="Contact Us">
      <div className="max-w-2xl">
        <p className="text-lg mb-6">Have a correction for a city? Want to suggest a new destination? We'd love to hear from you.</p>
        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-xl mb-2">Email Us</h2>
          <a href="mailto:efwfew1611@gmail.com" className="text-indigo-600 dark:text-indigo-400 text-lg hover:underline font-medium">
            efwfew1611@gmail.com
          </a>
        </div>
      </div>
    </InfoPageLayout>
  )
}