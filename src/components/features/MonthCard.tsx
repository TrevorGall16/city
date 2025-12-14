import { Thermometer, Shirt, CheckCircle2, XCircle } from 'lucide-react'

interface MonthCardProps {
  month: {
    id: number // 1 = Jan, 12 = Dec
    name: string
    temp: string
    vibe: string
    pros: string[]
    cons: string[]
    clothing: string
  }
}

// Helper: Get color theme based strictly on Month ID (Seasonality)
// Using saturated 100/200 shades for better contrast
const getMonthTheme = (monthId: number) => {
  switch (monthId) {
    // WINTER (Cold / Festive)
    case 12: // Dec
      return 'bg-indigo-100 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700'
    case 1:  // Jan
      return 'bg-blue-100 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700'
    case 2:  // Feb
      return 'bg-sky-100 dark:bg-sky-950/50 border-sky-300 dark:border-sky-700'
    
    // SPRING (Fresh / Blooming)
    case 3:  // Mar
      return 'bg-teal-100 dark:bg-teal-950/50 border-teal-300 dark:border-teal-700'
    case 4:  // Apr
      return 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700'
    case 5:  // May
      return 'bg-green-100 dark:bg-green-950/50 border-green-300 dark:border-green-700'
    
    // SUMMER (Hot / Vibrant)
    case 6:  // Jun
      return 'bg-lime-100 dark:bg-lime-950/50 border-lime-300 dark:border-lime-700'
    case 7:  // Jul
      return 'bg-yellow-100 dark:bg-yellow-950/50 border-yellow-300 dark:border-yellow-700'
    case 8:  // Aug (Peak Heat)
      return 'bg-orange-100 dark:bg-orange-950/50 border-orange-300 dark:border-orange-700'
    
    // AUTUMN (Golden / Cooling)
    case 9:  // Sep
      return 'bg-amber-100 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700'
    case 10: // Oct
      return 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' // Slightly muted orange
    case 11: // Nov
      return 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600' // Grey transition
      
    default:
      return 'bg-slate-50 border-slate-200'
  }
}

export function MonthCard({ month }: MonthCardProps) {
  const themeClass = getMonthTheme(month.id)

  return (
    <div className={`
      relative rounded-xl border-2 p-5 flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      ${themeClass}
    `}>
      {/* Header: Month & Temp */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">{month.name}</h3>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 opacity-90">
            {month.vibe}
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono font-bold text-sm bg-white/80 dark:bg-black/40 px-2 py-1 rounded-md shadow-sm text-slate-900 dark:text-white border border-black/5">
          <Thermometer className="w-4 h-4" />
          {month.temp}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="space-y-4 flex-grow">
        {/* Pros - Darker Green Icon for contrast */}
        <div>
          <ul className="text-sm space-y-1.5">
            {month.pros.slice(0, 2).map((pro) => (
              <li key={pro} className="flex items-start gap-2 leading-snug text-slate-800 dark:text-slate-100">
                <CheckCircle2 className="w-4 h-4 text-green-700 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <span className="font-medium opacity-90">{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Cons - Darker Red Icon for contrast */}
        <div>
          <div className="flex items-start gap-2 leading-snug text-slate-800 dark:text-slate-100">
            <XCircle className="w-4 h-4 text-red-700 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <span className="font-medium opacity-90 text-sm">{month.cons[0]}</span>
          </div>
        </div>
      </div>

      {/* Clothing Tip */}
      <div className="mt-5 pt-3 border-t border-black/10 dark:border-white/10">
        <div className="bg-white/70 dark:bg-black/30 rounded-lg p-3 flex items-start gap-3 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-700 p-1.5 rounded-md shadow-sm">
            <Shirt className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">Pack This</p>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-snug">
              {month.clothing}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}