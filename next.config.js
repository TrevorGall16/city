/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, 
  
  images: {
    // 🎯 MASTER AI STABILITY LOCK:
    unoptimized: true, 
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },

  async headers() {
    return [
      {
        source: '/images/:path*', 
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // 🛰️ MASTER AI: EMERGENCY BUILD LOCK
  // This section prevents the 31-worker memory crash on Netlify
  experimental: {
    cpus: 1,
    workerThreads: false,
    staticworkerthreads: false,
  },
}

module.exports = nextConfig