import { getAvailableLanguages } from '@/lib/getAvailableLanguages'
import { AvailableLanguagesUpdater } from '@/components/AvailableLanguagesUpdater'

interface CityLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string; citySlug: string }>
}

export default async function CityLayout({ children, params }: CityLayoutProps) {
  const { citySlug } = await params
  const availableLanguages = getAvailableLanguages(citySlug)

  return (
    <>
      <AvailableLanguagesUpdater languages={availableLanguages} />
      {children}
    </>
  )
}
