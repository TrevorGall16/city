const fs = require('fs');
const path = require('path');

// ============================================================================
// DYNAMIC SITEMAP GENERATOR V3
// - Splits sitemaps into 'Main' (Cities/Static) and 'Items' (Places)
// - Adds Google Image extensions for Visual Search
// - Gates per-city sub-URLs on actual data presence (no dead links to Google)
// ============================================================================

const BASE_URL = 'https://citybasic.com';
const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

const staticPaths = ['', '/about', '/contact', '/privacy', '/terms', '/how-to-use', '/corrections'];

const CATEGORY_FIELD = {
  food: 'must_eat',
  sights: 'must_see',
  coffee: 'best_coffee',
  bakeries: 'best_bakeries',
  stay: 'where_to_stay',
  'cheap-eats': 'cheap_eats',
};

function readCity(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

function flattenSights(city) {
  return (city.must_see || []).flatMap((group) => group?.items || []);
}

function hasCategoryData(city, category) {
  const field = CATEGORY_FIELD[category];
  if (!field) return false;
  const value = city?.[field];
  if (!Array.isArray(value) || value.length === 0) return false;
  if (category === 'sights') {
    return value.some(
      (group) => Array.isArray(group?.items) && group.items.length > 0
    );
  }
  return true;
}

function hasItineraryData(city) {
  const sightsCount = flattenSights(city).length;
  const foodCount = (city.must_eat || []).length;
  return sightsCount + foodCount > 0;
}

function getAllCities() {
  const citiesDir = path.join(__dirname, '..', 'src', 'data', 'cities');
  try {
    return fs
      .readdirSync(citiesDir)
      .filter((file) => file.endsWith('.json') && !/-\w{2}\.json$/.test(file))
      .map((file) => {
        const filePath = path.join(citiesDir, file);
        const city = readCity(filePath);
        if (!city) return null;
        return {
          slug: file.replace('.json', ''),
          image: city.hero_image,
          city,
        };
      })
      .filter(Boolean);
  } catch {
    return [];
  }
}

function getCityPlaces(city) {
  const places = [];
  flattenSights(city).forEach((p) => {
    if (p?.slug) places.push({ slug: p.slug, image: p.image });
  });
  (city.must_eat || []).forEach((p) => {
    if (p?.slug) places.push({ slug: p.slug, image: p.image });
  });
  return places;
}

function generateSitemap() {
  console.log('Starting sitemap generation...\n');

  const mainUrls = [];
  const itemUrls = [];

  // Static pages
  staticPaths.forEach((route) => {
    locales.forEach((lang) => {
      mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`);
    });
  });

  const cities = getAllCities();

  cities.forEach(({ slug, image, city }) => {
    locales.forEach((lang) => {
      const imageTag = image
        ? `
    <image:image>
      <image:loc>${BASE_URL}${image}</image:loc>
    </image:image>`
        : '';

      mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageTag}
  </url>`);

      // Lists: only categories with data
      Object.keys(CATEGORY_FIELD).forEach((category) => {
        if (!hasCategoryData(city, category)) return;
        mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}/lists/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`);
      });

      // Itinerary: only when there's content to populate it
      if (hasItineraryData(city)) {
        ['1-day', '2-days', '3-days'].forEach((duration) => {
          mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}/itinerary/${duration}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
        });
      }

      // Info topics: emit one URL per logistics topic that exists
      const topics = Array.isArray(city.logistics) ? city.logistics : [];
      topics.forEach((topic) => {
        if (!topic?.slug) return;
        mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}/info/${topic.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
      });

      // Gallery: only when there's at least one place image
      const places = getCityPlaces(city);
      if (places.length > 0) {
        mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}/gallery</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`);
      }
    });
  });

  // Per-place pages
  cities.forEach(({ slug, city }) => {
    const places = getCityPlaces(city);
    places.forEach((place) => {
      locales.forEach((lang) => {
        const imageTag = place.image
          ? `
    <image:image>
      <image:loc>${BASE_URL}${place.image}</image:loc>
    </image:image>`
          : '';

        itemUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${slug}/${place.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageTag}
  </url>`);
      });
    });
  });

  // Write outputs
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  fs.writeFileSync(
    path.join(publicDir, 'sitemap-main.xml'),
    `${header}${mainUrls.join('')}\n</urlset>`
  );
  console.log(`sitemap-main.xml created (${mainUrls.length} URLs)`);

  fs.writeFileSync(
    path.join(publicDir, 'sitemap-items.xml'),
    `${header}${itemUrls.join('')}\n</urlset>`
  );
  console.log(`sitemap-items.xml created (${itemUrls.length} URLs)`);

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-main.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-items.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), indexXml);
  console.log('sitemap.xml index created.\n');
}

generateSitemap();
