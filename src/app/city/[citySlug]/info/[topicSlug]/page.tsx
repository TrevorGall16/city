/**
 * Info Topic Detail Page (SSG)
 * Displays full details for logistics topics (transit, safety, scams, etc.)
 * Following the same SSG pattern as place detail pages
 */

import { notFound } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import type { City } from '@/types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import * as Icons from 'lucide-react'

// Type definition for Page Props in Next.js 15+
interface PageProps {
  params: Promise<{ citySlug: string; topicSlug: string }>
}

async function getCityData(slug: string): Promise<City | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/cities', `${slug}.json`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(fileContent)
  } catch {
    return null
  }
}

// SSG: Generate static params for all info topics
export async function generateStaticParams() {
  const citiesDir = path.join(process.cwd(), 'src/data/cities')
  const files = await fs.readdir(citiesDir)

  const params: Array<{ citySlug: string; topicSlug: string }> = []

  for (const file of files) {
    if (file.endsWith('.json')) {
      const citySlug = file.replace('.json', '')
      const filePath = path.join(citiesDir, file)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const city: City = JSON.parse(fileContent)

      // Generate params for each logistics topic
      city.logistics.forEach(topic => {
        params.push({
          citySlug,
          topicSlug: topic.slug,
        })
      })
    }
  }

  return params
}

// SEO: Generate metadata for each info topic
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug, topicSlug } = await params
  const city = await getCityData(citySlug)

  if (!city) {
    return {
      title: 'City Not Found',
    }
  }

  const topic = city.logistics.find(t => t.slug === topicSlug)

  if (!topic) {
    return {
      title: 'Topic Not Found',
    }
  }

  return {
    title: `${topic.title} - ${city.name} Travel Guide`,
    description: topic.summary,
  }
}

export default async function InfoTopicPage({ params }: PageProps) {
  const { citySlug, topicSlug } = await params
  const city = await getCityData(citySlug)

  if (!city) {
    notFound()
  }

  const topic = city.logistics.find(t => t.slug === topicSlug)

  if (!topic) {
    notFound()
  }

  // Dynamically get the icon component
  const IconComponent = Icons[topic.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }> || Icons.Info

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-6">
          <Link
            href={`/city/${citySlug}`}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {city.name}
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {topic.title}
            </h1>
          </div>
          <p className="text-lg text-slate-600 mt-2">
            {topic.summary}
          </p>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="prose prose-lg prose-slate max-w-none">
          {topic.details.map((paragraph, index) => (
            <p key={index} className="text-slate-700 leading-relaxed mb-6">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  )
}
