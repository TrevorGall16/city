/**
 * NeighborhoodCard Component
 * Displays neighborhood vibe and highlights
 */

interface NeighborhoodCardProps {
  neighborhood: {
    name: string
    vibe: string
    description: string
    highlights: string[]
  }
}

export function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          {neighborhood.name}
        </h3>
        <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">
          {neighborhood.vibe}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
        {neighborhood.description}
      </p>

      {/* Highlights */}
      {neighborhood.highlights.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-2">
            Highlights
          </div>
          <ul className="space-y-1.5">
            {neighborhood.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start text-sm text-slate-700 dark:text-slate-300">
                <span className="mr-2 text-indigo-600 dark:text-indigo-400">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
