/**
 * Category Filter Component
 * Sticky filter bar for filtering places by category
 */

'use client'

import { useState } from 'react'

export type FilterCategory = 'all' | 'landmark' | 'museum' | 'food' | 'hidden-gem' | 'favorites'

interface CategoryFilterProps {
  onFilterChange: (category: FilterCategory) => void
  activeFilter: FilterCategory
  showFavoritesFilter?: boolean
}

export function CategoryFilter({
  onFilterChange,
  activeFilter,
  showFavoritesFilter = true,
}: CategoryFilterProps) {
  const categories: { id: FilterCategory; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🌍' },
    { id: 'landmark', label: 'Landmarks', emoji: '🏛️' },
    { id: 'museum', label: 'Museums', emoji: '🎨' },
    { id: 'food', label: 'Food', emoji: '🍽️' },
    { id: 'hidden-gem', label: 'Hidden Gems', emoji: '💎' },
  ]

  if (showFavoritesFilter) {
    categories.push({ id: 'favorites', label: 'Favorites', emoji: '❤️' })
  }

  return (
    <div className="sticky top-16 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-4">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onFilterChange(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm
                transition-all duration-200 flex-shrink-0
                ${
                  activeFilter === category.id
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
              `}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
