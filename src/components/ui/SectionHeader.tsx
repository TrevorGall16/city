/**
 * SectionHeader Component
 * Reusable section header with flag-themed left border
 */

interface SectionHeaderProps {
  title: string
  countryCode: string
  subtitle?: string
  accentText?: string // Country-specific text color (e.g., 'text-red-700 dark:text-red-400')
}

const FLAG_GRADIENTS: Record<string, string> = {
  fr: 'from-blue-600 via-white to-red-600', // French flag
  de: 'from-black via-red-600 to-yellow-500', // German flag
  jp: 'from-white via-red-600 to-white', // Japanese flag
  // Add more countries as needed
}

export function SectionHeader({ title, countryCode, subtitle, accentText }: SectionHeaderProps) {
  const gradient = FLAG_GRADIENTS[countryCode] || 'from-indigo-600 via-slate-200 to-indigo-600'
  const textColor = accentText || 'text-indigo-900 dark:text-white'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4">
        {/* Flag-colored left border */}
        <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${gradient}`} />

        <div>
          <h2 className={`text-4xl md:text-5xl font-bold ${textColor}`}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
