/**
 * 🛰️ MASTER AI: SECTION HEADER GOLDEN MASTER (V6.0)
 * ✅ Style: 2026 Editorial with Flag-Aura markers.
 * ✅ Typography: Ultra-bold font-black with tight tracking.
 * ✅ Design: Silk-blur depth for country-specific branding.
 */

interface SectionHeaderProps {
  title: string
  countryCode: string
  subtitle?: string
}

const FLAG_AURA: Record<string, string> = {
  fr: 'from-blue-600 via-white to-red-600', 
  de: 'from-zinc-950 via-red-600 to-amber-400', 
  jp: 'from-white via-red-500 to-white', 
  it: 'from-emerald-600 via-white to-red-600',
  es: 'from-red-600 via-yellow-400 to-red-600',
  th: 'from-red-600 via-white via-blue-800 via-white to-red-600',
  us: 'from-blue-700 via-white to-red-600',
  gb: 'from-blue-800 via-white to-red-700',
}

export function SectionHeader({ title, countryCode, subtitle }: SectionHeaderProps) {
  const aura = FLAG_AURA[countryCode?.toLowerCase()] || 'from-indigo-600 via-slate-200 to-indigo-600'

  return (
    <div className="relative group mb-12 animate-in slide-in-from-left duration-700">
      <div className="flex items-start gap-6">
        {/* 🏳️ FLAG-AURA MARKER */}
        <div className="relative">
          <div className={`w-2 h-16 rounded-full bg-gradient-to-b ${aura} shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]`} />
          <div className={`absolute inset-0 w-2 h-16 rounded-full bg-gradient-to-b ${aura} blur-md opacity-40 group-hover:opacity-100 transition-opacity duration-500`} />
        </div>

        <div className="flex flex-col">
          {/* Section ID Mark */}
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mb-2">
            Section Guide
          </span>
          
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
            {title}
          </h2>
          
          {subtitle && (
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}