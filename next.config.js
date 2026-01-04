/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true, // 🚀 Boosts loading speed for mobile users
  
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/webp', 'image/avif'],
    // 🛡️ SECURITY: Only allow your trusted assets
    remotePatterns: [
      { protocol: 'https', hostname: 'citybasic.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Example if using Unsplash
    ],
  },

  async headers() {
    return [
      {
        source: '/city/:path*',
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