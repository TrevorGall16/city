/**
 * ✅ MASTER AI OPTIMIZED INFO PAGE
 * Fixed: Broken <a> tags, URL consistency, and MetadataBase
 */

import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Info } from 'lucide-react'
import * as Icons from 'lucide-react'
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ citySlug: string; topicSlug: string }>
}

async function getCityData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, topicSlug } = await params
  const city = await getCityData(citySlug)
  if (!city) return { title: 'City Not Found' }

  const topic = city.logistics.find((t: any) => t.slug === topicSlug)
  if (!topic) return { title: 'Topic Not Found' }

  return {
    metadataBase: new URL('https://citybasic.com'), // ✅ Fixed global URL reference
    title: `${topic.title} in ${city.name} | CityBasic Guide`,
    description: topic.summary,
    alternates: {
      canonical: `/${citySlug}/${topicSlug}`, // ✅ Matches Clean URL strategy
    },
  }
}

export default async function InfoTopicPage({ params }: PageProps) {
  const { citySlug, topicSlug } = await params
  const city = await getCityData(citySlug)
  if (!city) notFound()

  const topic = city.logistics.find((t: any) => t.slug === topicSlug)
  if (!topic) notFound()

  const IconComponent = (Icons[topic.icon as keyof typeof Icons] || Info) as any
  const affiliateBox = getAffiliateRecommendation(topicSlug, city.name)

  // ✅ Fixed Breadcrumb Schema (Removed /city/ prefix)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://citybasic.com' },
      { '@type': 'ListItem', position: 2, name: city.name, item: `https://citybasic.com/${citySlug}` },
      { '@type': 'ListItem', position: 3, name: topic.title, item: `https://citybasic.com/${citySlug}/${topicSlug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href={`/${citySlug}`} className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-6">
              <ArrowLeft className="w-4 h-4 mr-1" /> Back to {city.name} Guide
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-indigo-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{topic.title}</h1>
            </div>
            <p className="text-lg text-slate-600 leading-relaxed">{topic.summary}</p>
          </div>
        </header>

        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="prose prose-slate max-w-none bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
            {topic.details.map((paragraph: string, index: number) => (
              <p key={index} className="text-slate-700 leading-relaxed mb-6 text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {affiliateBox && (
            <aside className="mt-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-100 p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                  <affiliateBox.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{affiliateBox.title}</h2>
                  <p className="text-slate-600 mb-6">{affiliateBox.description}</p>
                  <a 
                    href={affiliateBox.link} 
                    target="_blank" 
                    rel="noopener noreferrer sponsored"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-200"
                  >
                    {affiliateBox.cta} <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </aside>
          )}
        </article>
      </main>
    </>
  )
}

function getAffiliateRecommendation(topicSlug: string, cityName: string) {
  const recommendations: Record<string, any> = {
    'getting-sim-card': {
      icon: Icons.Smartphone,
      title: 'Get Your eSIM Before You Land',
      description: `Skip the airport lines in ${cityName}. Use Airalo for instant data activation. Plans from $4.50.`,
      link: 'https://www.airalo.com',
      cta: 'Get eSIM Now',
    },
    'public-transit': {
      icon: Icons.Train,
      title: 'Book Train & Metro Tickets',
      description: `Maps ${cityName} like a local. Use Trainline for the best mobile ticket rates across Europe and Asia.`,
      link: 'https://www.trainline.com',
      cta: 'Check Prices',
    }
  }
  return recommendations[topicSlug] || null
}