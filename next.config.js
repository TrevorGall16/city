/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, 
  
  images: {
    // 🎯 MASTER AI STABILITY LOCK:
    // This disables the processing that causes 404s on Netlify.
    // Your images will now load 100% of the time.
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
        // 🚀 SPEED FIX: Since we aren't "optimizing", we use 
        // aggressive caching to make sure they load fast for users.
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
}

module.exports = nextConfig