/**
 * Affiliate Link Generators
 * Centralized helpers for building dynamic affiliate URLs.
 */

const TRIP_COM_AFFILIATE_ID = 'citybasic'

export function getTripComLink(cityName: string): string {
  // Calculate dates: check-in = tomorrow, check-out = day after
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dayAfter = new Date()
  dayAfter.setDate(dayAfter.getDate() + 2)

  const fmt = (d: Date) => d.toISOString().split('T')[0] // YYYY-MM-DD

  const keyword = encodeURIComponent(cityName)

  return `https://www.trip.com/hotels/?keyword=${keyword}&checkin=${fmt(tomorrow)}&checkout=${fmt(dayAfter)}&utm_source=${TRIP_COM_AFFILIATE_ID}&utm_medium=affiliate`
}
