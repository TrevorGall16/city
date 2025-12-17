/**
 * CityCard Component
 * Following 03_UI strict specifications (section 2.1)
 *
 * Entry point on Homepage - links to City Sheet
 */

import Image from 'next/image'
import Link from 'next/link'

interface CityCardProps {
  name: string
  country: string
  image: string
  slug: string
  priority?: boolean
}

export function CityCard({
  name,
  country,
  image,
  slug,
  priority = false
}: CityCardProps) {
  return (
    <Link href={`/city/${slug}`} className="group">
      <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
<Image 
  src={image} 
  alt={name}
  fill 
  priority={priority} // ✅ This helps the first 3 cities load instantly
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover group-hover:scale-110 transition-transform duration-500"
/>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="text-lg font-semibold leading-tight">
              {name}
            </h3>
            <p className="text-sm text-white/90">
              {country}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
