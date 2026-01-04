/**
 * 🛰️ MASTER AI: GLOBAL FOOTER GOLDEN MASTER (V5.0)
 * ✅ Full Localization: All headers and links utilize the dict prop
 * ✅ Dynamic Routing: Uses useParams to ensure the correct /[lang]/ pathing
 * ✅ Premium Aesthetic: High-saturation typography and improved spacing
 */

'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getDict } from '@/data/dictionaries'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const params = useParams()
  
  // ✅ Get the current language safely from URL or default to 'en'
  const lang = (params?.lang as string) || 'en'
  const dict = getDict(lang)

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <h3 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 dark:text-white">
              CityBasic
            </h3>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
              {dict.hero_subtitle || 'No-fluff travel guides with instant translation.'}
            </p>
          </div>

          {/* Navigation - Explore */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-8">
              {dict.explore || 'Explore'}
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li>
                <Link href={`/${lang}`} className="hover:text-indigo-600 transition-colors">
                  {dict.home || 'Home'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/city/paris`} className="hover:text-indigo-600 transition-colors">
                  Paris
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/city/tokyo`} className="hover:text-indigo-600 transition-colors">
                  Tokyo
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-8">
              {dict.company || 'Company'}
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li>
                <Link href={`/${lang}/about`} className="hover:text-indigo-600 transition-colors">
                  {dict.about_us || 'About CityBasic'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/how-to-use`} className="hover:text-indigo-600 transition-colors">
                  {dict.how_to_use || 'How to Use'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/corrections`} className="hover:text-indigo-600 transition-colors">
                  {dict.submit_correction || 'Submit a Correction'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-400 mb-8">
              {dict.legal || 'Legal'}
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600 dark:text-slate-400">
              <li>
                <Link href={`/${lang}/privacy`} className="hover:text-indigo-600 transition-colors">
                  {dict.privacy_policy || 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/terms`} className="hover:text-indigo-600 transition-colors">
                  {dict.terms_of_service || 'Terms of Service'}
                </Link>
              </li>
              <li>
                {/* ✅ FIXED: Now links to the internal localized contact page */}
                <Link href={`/${lang}/contact`} className="hover:text-indigo-600 transition-colors">
                  {dict.contact_us || 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-widest uppercase italic">
            CityBasic.com
          </p>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            © {currentYear} {dict.all_rights_reserved || 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}