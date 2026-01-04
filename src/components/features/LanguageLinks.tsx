import Link from 'next/link'

const LANG_MAP: Record<string, string> = {
  en: "🇺🇸 English", fr: "🇫🇷 Français", es: "🇪🇸 Español",
  it: "🇮🇹 Italiano", ja: "🇯🇵 日本語", hi: "🇮🇳 हिन्दी",
  de: "🇩🇪 Deutsch", zh: "🇨🇳 中文", ar: "🇸🇦 العربية"
}

export function LanguageLinks({ citySlug, currentLang }: { citySlug: string, currentLang: string }) {
  return (
    <div className="mt-12 py-8 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">
        Read this guide in another language
      </h3>
      <div className="flex flex-wrap justify-center gap-3">
        {Object.entries(LANG_MAP).map(([code, label]) => (
          code !== currentLang && (
            <Link
              key={code}
              href={`/${code}/city/${citySlug}`}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
            >
              {label}
            </Link>
          )
        ))}
      </div>
    </div>
  )
}