/**
 * Best Time Calendar Widget
 * Shows 12 months with highlighted best times to visit
 */

interface BestTimeCalendarProps {
  bestMonths: number[] // 0=Jan, 11=Dec
  summary: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function BestTimeCalendar({ bestMonths, summary }: BestTimeCalendarProps) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-slate-600">{summary}</div>
      <div className="grid grid-cols-12 gap-1">
        {MONTHS.map((month, index) => {
          const isBestTime = bestMonths.includes(index)
          return (
            <div
              key={month}
              className={`
                text-center py-2 rounded text-xs font-medium transition-colors
                ${isBestTime
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-200 text-slate-500'}
              `}
              title={isBestTime ? `${month} - Great time to visit` : month}
            >
              {month}
            </div>
          )
        })}
      </div>
    </div>
  )
}
