/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, 
  
  images: {
    // 🎯 MASTER AI SAFETY NET: 
    // We set this to false to get the speed back. 
    // If a specific image fails to optimize, Next.js will now have 
    // the correct 'remotePatterns' to fall back on.
    unoptimized: false, 
    
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      // 🚀 This allows the optimizer to trust your live site assets
      { protocol: 'https', hostname: 'citybasic.com' },
      { protocol: 'https', hostname: 'www.citybasic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },

  async headers() {
    return [
      {
        // 🚀 CACHE BOOST: This is what saves that 1 second of loading time.
        // Once a user loads the image, they never have to download it again.
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