/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Enable experimental features for better performance
  experimental: {
//experimental: { optimizeCss: true }  <-- REMOVE OR COMMENT OUT THIS LINE//
  },

  // ISR revalidation
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
    ]
  },
}

module.exports = nextConfig
