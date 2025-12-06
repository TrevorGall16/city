/**
 * SectionHeader Component
 * Reusable section header with flag-themed left border
 */

interface SectionHeaderProps {
  title: string
  countryCode: string
  subtitle?: string
}

const FLAG_GRADIENTS: Record<string, string> = {
  fr: 'from-blue-600 via-white to-red-600', // French flag
  // Add more countries as needed
}

export function SectionHeader({ title, countryCode, subtitle }: SectionHeaderProps) {
  const gradient = FLAG_GRADIENTS[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        {/* Flag-colored left border */}
        <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${gradient}`} />

        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
