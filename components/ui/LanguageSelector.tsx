'use client'

import { useRouter, usePathname } from 'next/navigation'

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
]

export function LanguageSelector() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (newLang: string) => {
    // pathname looks like "/en/city/paris" or "/city/paris"
    const segments = pathname.split('/')
    
    // This logic ensures we replace or add the language code at the start
    if (LANGUAGES.some(l => l.code === segments[1])) {
      segments[1] = newLang
    } else {
      segments.splice(1, 0, newLang)
    }
    
    router.push(segments.join('/') || '/')
  }

  // Find current language to show in the dropdown
  const currentLang = LANGUAGES.find(l => pathname.startsWith(`/${l.code}`)) || LANGUAGES[0]

  return (
    <div className="relative inline-block text-left">
      <select 
        value={currentLang.code}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-1.5 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
      {/* Small arrow icon for the select */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
      </div>
    </div>
  )
}