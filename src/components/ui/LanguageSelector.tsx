"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useAvailableLanguages } from '@/context/AvailableLanguagesContext';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export function LanguageSelector() {
  const pathname = usePathname();
  const { availableLanguages } = useAvailableLanguages();

  // Extract current lang (first part of path)
  const currentLang = pathname.split('/')[1] || 'en';

  // Filter languages: if on a city page with known availability, only show those
  const displayLanguages = availableLanguages
    ? LANGUAGES.filter((lang) => availableLanguages.includes(lang.code))
    : LANGUAGES;

  // Helper to switch URL prefix
  const getSwitchLink = (newLang: string) => {
    const segments = pathname.split('/');
    segments[1] = newLang; // Replace 'en' with 'fr', etc.
    return segments.join('/');
  };

  return (
    <div className="relative group z-[100]">
      {/* TRIGGER BUTTON */}
      <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Globe className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        <span className="uppercase text-sm font-bold text-slate-700 dark:text-slate-200">
          {currentLang}
        </span>
      </button>

      {/* INVISIBLE BRIDGE
         This invisible div fills the gap so the menu doesn't close when you move your mouse down.
      */}
      <div className="absolute top-full left-0 w-full h-4 bg-transparent" />

      {/* DROPDOWN MENU */}
      <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-[100] max-h-[80vh] overflow-y-auto">
        <div className="p-2 flex flex-col gap-1">
          {displayLanguages.map((lang) => (
            <Link
              key={lang.code}
              href={getSwitchLink(lang.code)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentLang === lang.code
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              {lang.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
