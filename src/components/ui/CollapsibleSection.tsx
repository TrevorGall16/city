'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  initialOpen?: boolean
}

export function CollapsibleSection({ title, subtitle, children, initialOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 px-4 md:px-8 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group"
      >
        <div className="text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h2>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full transition-transform duration-200">
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      {/* ✅ FIX: Only render the div if open. This removes the 'empty box' space. */}
      {isOpen && (
        <div className="pb-12 animate-in fade-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  )
}