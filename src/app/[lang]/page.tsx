import { Metadata } from 'next'
import { Suspense } from 'react'
import { HomePageClient } from '@/components/pages/HomePageClient'
import AdsterraBanner from '@/components/ads/AdsterraBanner'
import { getDict } from '@/data/dictionaries'
import { getAllCities } from '@/lib/getCityData'
import { LOCALES } from '@/data/locales'

interface HomeProps {
  params: Promise<{ lang: string }>
}

const BASE_URL = 'https://citybasic.com'

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const resolvedParams = await params
  const lang = resolvedParams.lang
  const cities = await getAllCities()
  return {
    title: `CityBasic: Travel Cheat Sheets for ${cities.length} Cities`,
    alternates: {
      canonical: `${BASE_URL}/${lang}`,
      languages: Object.fromEntries(LOCALES.map(l => [l, `${BASE_URL}/${l}`])),
    }
  }
}

export default async function HomePage({ params }: HomeProps) {
  const resolvedParams = await params
  const lang = resolvedParams.lang 
  const dict = getDict(lang) 
  const allCities = await getAllCities()
  const regions = groupCitiesByRegion(allCities, dict)
  
  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
        <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-center">
           <AdsterraBanner height={90} width={728} pKey="258fbd7f9475277565c29c04ed1299f6" />
        </div>

        <HomePageClient 
          cities={allCities} 
          regions={regions} 
          lang={lang} 
          translations={{
            hero_title: dict.hero_title || "Pick a city and get what you need.",
            hero_subtitle: dict.hero_subtitle || "Travel cheat sheets with useful phrases and no fluff.",
            featured_cities: dict.featured_cities,
            view_guide: dict.view_guide,
            explore_world: "Explore the World" 
          }}
        />
      </Suspense>
    </div>
  )
}

function groupCitiesByRegion(cities: any[], dict: any) {
  const regionNames = [
    dict.europe, dict.asia, dict.north_america, 
    dict.south_america, dict.middle_east, dict.africa, 
    dict.oceania || 'Oceania'
  ]

  const regionGroups: Record<string, any> = {}
  regionNames.forEach(name => { if (name) regionGroups[name] = { name, countries: {} } })
  regionGroups["Other"] = { name: "Other", countries: {} }

  cities.forEach(city => {
    let targetGroup = "Other"
    const r = city.region?.trim().toLowerCase()
    
    if (r === 'europe') targetGroup = dict.europe
    else if (r === 'asia') targetGroup = dict.asia
    else if (r === 'north america') targetGroup = dict.north_america
    else if (r === 'south america') targetGroup = dict.south_america
    else if (r === 'middle east') targetGroup = dict.middle_east
    else if (r === 'africa') targetGroup = dict.africa
    else if (r === 'oceania') targetGroup = dict.oceania || 'Oceania'

    if (!regionGroups[targetGroup]) targetGroup = "Other"

    if (!regionGroups[targetGroup].countries[city.country]) {
      regionGroups[targetGroup].countries[city.country] = {
        name: city.country,
        country_code: city.country_code,
        cities: []
      }
    }
    regionGroups[targetGroup].countries[city.country].cities.push(city)
  })

  return Object.values(regionGroups)
    .filter((region: any) => Object.keys(region.countries).length > 0)
    .map((region: any) => ({
      name: region.name,
      countries: Object.values(region.countries)
    }))
}