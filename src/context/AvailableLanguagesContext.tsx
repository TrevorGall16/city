'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AvailableLanguagesContextValue {
  /** null = show all languages (non-city pages) */
  availableLanguages: string[] | null
  setAvailableLanguages: (langs: string[] | null) => void
}

const AvailableLanguagesContext = createContext<AvailableLanguagesContextValue>({
  availableLanguages: null,
  setAvailableLanguages: () => {},
})

export function AvailableLanguagesProvider({ children }: { children: ReactNode }) {
  const [availableLanguages, setAvailableLanguagesRaw] = useState<string[] | null>(null)

  const setAvailableLanguages = useCallback((langs: string[] | null) => {
    setAvailableLanguagesRaw(langs)
  }, [])

  return (
    <AvailableLanguagesContext.Provider value={{ availableLanguages, setAvailableLanguages }}>
      {children}
    </AvailableLanguagesContext.Provider>
  )
}

export function useAvailableLanguages() {
  return useContext(AvailableLanguagesContext)
}
