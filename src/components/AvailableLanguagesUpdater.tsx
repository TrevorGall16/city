'use client'

import { useEffect } from 'react'
import { useAvailableLanguages } from '@/context/AvailableLanguagesContext'

/**
 * Rendered inside city layouts to push the available languages into context.
 * On unmount (navigating away from city pages), resets to null so the
 * header language selector shows all languages again.
 */
export function AvailableLanguagesUpdater({ languages }: { languages: string[] }) {
  const { setAvailableLanguages } = useAvailableLanguages()

  useEffect(() => {
    setAvailableLanguages(languages)
    return () => setAvailableLanguages(null)
  }, [languages, setAvailableLanguages])

  return null
}
