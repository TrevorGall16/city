'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface ImageLightboxProps {
  src: string
  alt: string
  children: React.ReactNode
}

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, close])

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-zoom-in">
        {children}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          onClick={close}
        >
          <div className="absolute inset-0 bg-black/90" />

          <button
            onClick={close}
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
              src={src}
              alt={alt}
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
