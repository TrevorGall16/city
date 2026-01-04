/**
 * 🛰️ MASTER AI: INFO PAGE GOLDEN MASTER (V6.0)
 * ✅ Layout: Centered editorial column for maximum readability.
 * ✅ Typography: Specialized prose-layer for legal and info text.
 * ✅ Navigation: Silk-blur breadcrumbs with localized Home routing.
 */

import Link from 'next/link'
import { ChevronRight, Home, Clock } from 'lucide-react'

interface InfoPageLayoutProps {
  title: string
  lastUpdated: string
  lang: string // Added to ensure correct home link
  children: React.ReactNode
}

export function InfoPageLayout({ title, lastUpdated, lang, children }: InfoPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* 🏙️ HEADER: Editorial Mesh */}
      <div className="relative pt-24 pb-16 overflow-hidden border-b border-slate-100 dark:border-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50/50 via-transparent to-transparent dark:from-indigo-900/10" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          {/* Minimalist Breadcrumbs */}
          <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
            <Link href={`/${lang}`} className="hover:text-indigo-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900 dark:text-white">{title}</span>
          </nav>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 uppercase">
            {title}
          </h1>

          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
            <Clock className="w-4 h-4" />
            <span>Updated:</span>
            <time className="text-slate-600 dark:text-slate-300">
              {new Date(lastUpdated).toLocaleDateString(lang, { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
          </div>
        </div>
      </div>

      {/* 📄 CONTENT: Professional Prose */}
      <article className="max-w-4xl mx-auto px-6 py-20">
        <div className="prose prose-slate dark:prose-invert max-w-none
          prose-h2:text-3xl prose-h2:font-black prose-h2:tracking-tighter prose-h2:uppercase prose-h2:mt-16 prose-h2:mb-8
          prose-h3:text-xl prose-h3:font-bold prose-h3:mt-10
          prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
          prose-li:text-lg prose-li:text-slate-600 dark:prose-li:text-slate-400
          prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-black
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>

        {/* Localized Back Action */}
        <div className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-900">
          <Link
            href={`/${lang}`}
            className="group inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-indigo-600"
          >
            <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Home className="w-4 h-4" />
            </div>
            Back to CityBasic
          </Link>
        </div>
      </article>
    </div>
  )
}