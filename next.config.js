/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // ⚡ MASTER AI: IMAGE OPTIMIZATION
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🛡️ MASTER AI: SAFETY LOCK
  experimental: {
    cpus: 1,
    workerThreads: false,
  },

  // 🚀 STATIC ASSET CACHING
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 👇 ADDED: Force XML Content-Type for sitemaps to please Google
      {
        source: '/:path*.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  
  // 🗑️ REMOVED: Rewrites (We are using static files now)

  // 🔗 LEGACY REDIRECTS
  async redirects() {
    return [
      {
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo|new-york|los-angeles|rio-de-janeiro|hong-kong)/:slug',
        destination: '/en/city/:city/:slug',
        permanent: true,
      },
      {
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo|new-york|los-angeles|rio-de-janeiro|hong-kong)',
        destination: '/en/city/:city',
        permanent: true,
      },
      {
         source: '/city/:path*',
         destination: '/en/city/:path*',
         permanent: true,
      }
    ]
  },
}

module.exports = nextConfig