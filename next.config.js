/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compress: true,

  // ⚡ MASTER AI: IMAGE OPTIMIZATION (Kept)
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    // Responsive sizes for mobile performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 🛡️ MASTER AI: SAFETY LOCK (REQUIRED)
  // Keeps the build from crashing on Netlify's limited memory.
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
  
  // 🗺️ SITEMAP REWRITE
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap' },
    ]
  },

  // 🔗 LEGACY REDIRECTS
  async redirects() {
    return [
      {
        // City + Slug Redirect (Includes new cities)
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo|new-york|los-angeles|rio-de-janeiro|hong-kong)/:slug',
        destination: '/en/city/:city/:slug',
        permanent: true,
      },
      {
        // City Root Redirect
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo|new-york|los-angeles|rio-de-janeiro|hong-kong)',
        destination: '/en/city/:city',
        permanent: true,
      },
      {
         // Generic catch-all
         source: '/city/:path*',
         destination: '/en/city/:path*',
         permanent: true,
      }
    ]
  },
}

module.exports = nextConfig