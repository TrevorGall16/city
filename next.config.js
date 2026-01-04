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
}
module.exports = nextConfig