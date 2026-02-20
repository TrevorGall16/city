'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface PlaceGalleryProps {
  images: string[]
}

export function PlaceGallery({ images }: PlaceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  return (
    <>
      <section className="mt-16 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-1 bg-indigo-500 rounded-full" /> Gallery
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-zoom-in group border border-white/50 dark:border-white/10 shadow-sm"
            >
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="absolute inset-0 bg-black/90" />
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative w-[90vw] h-[90vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`Gallery image ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
