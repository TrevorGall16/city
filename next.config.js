/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, 
  
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    // 🎯 MASTER AI FIX: Allow local images + remote sources
    remotePatterns: [
      { protocol: 'https', hostname: 'citybasic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' }, // Added for your profile avatars
    ],
    // 🛡️ Added for local public folder reliability on Netlify
    unoptimized: process.env.NODE_ENV === 'production' ? false : false, 
  },

  async headers() {
    return [
      {
        // 🎯 FIXED: Updated path to include /[lang]/ structure
        source: '/:lang/city/:path*', 
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig