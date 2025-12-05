/**
 * Category Taxonomy Definition
 * Following 05_Data_API specification
 */

import { Camera, Utensils } from 'lucide-react'

export const CATEGORIES = {
  food: {
    label: 'Must Eat',
    icon: Utensils,
    color: 'amber',
  },
  sight: {
    label: 'Must See',
    icon: Camera,
    color: 'indigo',
  },
} as const

export type CategoryKey = keyof typeof CATEGORIES
