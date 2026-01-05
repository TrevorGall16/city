/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, 
  images: {
    unoptimized: true, 
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  
  // 🎯 MASTER AI: REWRITES (For Sitemap)
  async rewrites() {
    return [
      { source: '/sitemap.xml', destination: '/api/sitemap' }, // (Optional if you use the script method, but harmless to keep)
    ]
  },

  // 🎯 MASTER AI: LEGACY REDIRECTS (The Fix)
  async redirects() {
    return [
      {
        // Catches: /berlin/techno-culture -> /en/city/berlin/techno-culture
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo)/:slug',
        destination: '/en/city/:city/:slug',
        permanent: true,
      },
      {
        // Catches: /berlin -> /en/city/berlin
        source: '/:city(bangkok|berlin|istanbul|london|paris|rome|tokyo)',
        destination: '/en/city/:city',
        permanent: true,
      },
      // Fix for URLs that have /city/ but are missing lang (e.g. /city/los-angeles)
      {
         source: '/city/:path*',
         destination: '/en/city/:path*',
         permanent: true,
      }
    ]
  },
}

module.exports = nextConfig