/**
 * 🛰️ MASTER AI: EDGE SITEMAP BYPASS
 * This runs BEFORE the Next.js language redirect.
 */
export default async (request, context) => {
  const url = new URL(request.url);

  // If the request is for our sitemap, fetch it directly from the API
  if (url.pathname === "/sitemap_index.xml" || url.pathname === "/sitemap.xml") {
    // We fetch from the API route we created, bypassing the /fr/ logic
    return await fetch(new URL("/api/sitemap", request.url));
  }

  // Otherwise, let everything else proceed to the normal Next.js logic
  return;
};

export const config = {
  path: ["/sitemap_index.xml", "/sitemap.xml"],
};