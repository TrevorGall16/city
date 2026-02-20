import fs from 'fs'
import path from 'path'

const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

export async function getPlaceImages(
  citySlug: string,
  placeSlug: string
): Promise<string[]> {
  // 🛡️ MASTER AI: EMERGENCY BYPASS
  // Prevents Netlify from zipping up 13,000 images into the server bundle
  if (process.env.NODE_ENV === 'production') {
    // For now, return empty. We will fix this with a Manifest later.
    return [] 
  }

  const dir = path.join(process.cwd(), 'public', 'images', citySlug, placeSlug)

  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir)

  return files
    .filter((f) => VALID_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => `/images/${citySlug}/${placeSlug}/${f}`)
}