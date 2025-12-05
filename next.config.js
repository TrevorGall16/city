/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 1. ALLOW SVGs (Required for placehold.co)
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

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

  // 2. Keep the ISR Headers (Your existing cache rules)
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
