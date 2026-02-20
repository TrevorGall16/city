// 🛰️ MASTER AI: ULTRALIGHT IMAGE FETCHER
// Uses the pre-generated manifest to avoid disk scanning in production.
import imageManifest from '@/data/image-manifest.json';

export async function getPlaceImages(
  citySlug: string,
  placeSlug: string
): Promise<string[]> {
  const key = `${citySlug}/${placeSlug}`;
  const files = (imageManifest as Record<string, string[]>)[key] || [];

  return files.map((f) => `/images/${citySlug}/${placeSlug}/${f}`);
}