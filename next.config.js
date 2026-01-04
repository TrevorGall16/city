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

  // 🎯 MASTER AI: INTERNAL REWRITE
  // This bypasses the middleware redirect by handling the URL 
  // before it even reaches the proxy/middleware.
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/sitemap_index.xml',
        destination: '/api/sitemap',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/images/:path*', 
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  experimental: {
    cpus: 1,
    workerThreads: false,
  },
}

module.exports = nextConfig