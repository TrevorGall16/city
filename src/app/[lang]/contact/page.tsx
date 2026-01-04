/**
 * 🛰️ MASTER AI: PREMIUM CONTACT PAGE (V1.0)
 * ✅ Localized: Supports all 9 languages via the dictionary
 * ✅ Minimalist: High-saturation design to match CityBasic aesthetic
 */

import { getDict } from '@/data/dictionaries'
import { Mail, MessageSquare, Globe } from 'lucide-react'

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const { lang } = await params
  const dict = await getDict(lang)

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-6xl font-black tracking-tighter uppercase mb-6 text-slate-900 dark:text-white">
          {dict.contact_us || 'Contact Us'}
        </h1>
        <p className="text-xl text-slate-500 font-medium mb-12">
          {dict.contact_subtitle || 'Have a question or a correction? We would love to hear from you.'}
        </p>

        <div className="grid grid-cols-1 gap-6">
          <a 
            href="mailto:efwfew1611@gmail.com" 
            className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex items-center justify-between group hover:border-indigo-500 transition-all shadow-sm"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600">
                <Mail className="w-8 h-8" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest text-slate-400">Email</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">efwfew1611@gmail.com</span>
              </div>
            </div>
            <span className="text-indigo-600 font-black group-hover:translate-x-2 transition-transform">→</span>
          </a>
        </div>
      </div>
    </main>
  )
}