import { useCallback } from 'react'

const SESSION_PREFIX = 'cityad_shown_'

export function useCityInterstitial(citySlug: string) {
  const hasShown = useCallback((): boolean => {
    if (typeof sessionStorage === 'undefined') return true
    return sessionStorage.getItem(`${SESSION_PREFIX}${citySlug}`) === '1'
  }, [citySlug])

  const markShown = useCallback((): void => {
    if (typeof sessionStorage === 'undefined') return
    sessionStorage.setItem(`${SESSION_PREFIX}${citySlug}`, '1')
  }, [citySlug])

  return { hasShown, markShown }
}
