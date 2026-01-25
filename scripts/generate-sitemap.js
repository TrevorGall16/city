const fs = require('fs');
const path = require('path');

// ============================================================================
// 🚀 DYNAMIC SITEMAP GENERATOR V2 (Split Strategy + Images)
// Splits sitemaps into 'Main' (Cities/Static) and 'Items' (Places)
// Adds Google Image extensions for Visual Search traffic
// ============================================================================

const BASE_URL = 'https://citybasic.com';
const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

// Static pages
const staticPaths = ['', '/about', '/contact', '/privacy', '/terms', '/how-to-use', '/corrections'];

function getAllCities() {
  const citiesDir = path.join(__dirname, '..', 'src', 'data', 'cities');
  try {
    return fs.readdirSync(citiesDir)
      .filter(file => file.endsWith('.json') && !/-\w{2}\.json$/.test(file))
      .map(file => {
        const content = JSON.parse(fs.readFileSync(path.join(citiesDir, file), 'utf-8'));
        return { slug: file.replace('.json', ''), image: content.hero_image };
      });
  } catch (error) { return []; }
}

function getCityPlaces(citySlug) {
  const filePath = path.join(__dirname, '..', 'src', 'data', 'cities', `${citySlug}.json`);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const places = [];
    const extract = (list) => {
      if (!list) return;
      list.forEach(item => {
        // Handle 'must_see' which has categories
        if (item.items) item.items.forEach(p => places.push({ slug: p.slug, image: p.image }));
        // Handle 'must_eat' which is a direct list
        else if (item.slug) places.push({ slug: item.slug, image: item.image });
      });
    };
    extract(data.must_see);
    extract(data.must_eat);
    return places;
  } catch { return []; }
}

function generateSitemap() {
  console.log('🗺️  Starting Split Sitemap Generation...\n');

  let mainUrls = [];
  let itemUrls = [];

  // 1. Generate Static & City URLs (Main Sitemap)
  console.log('📄 Processing Static & City Pages...');
  
  // Static
  staticPaths.forEach(route => {
    locales.forEach(lang => {
      mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`);
    });
  });

  // Cities
  const cities = getAllCities();
  cities.forEach(city => {
    locales.forEach(lang => {
      // Add Image Tag for Visual Search
      const imageTag = city.image ? `
    <image:image>
      <image:loc>${BASE_URL}${city.image}</image:loc>
    </image:image>` : '';

      mainUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${city.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>${imageTag}
  </url>`);
    });
  });

  // 2. Generate Item URLs (Items Sitemap)
  console.log('🏛️  Processing Item Pages...');
  cities.forEach(city => {
    const places = getCityPlaces(city.slug);
    places.forEach(place => {
      locales.forEach(lang => {
        const imageTag = place.image ? `
    <image:image>
      <image:loc>${BASE_URL}${place.image}</image:loc>
    </image:image>` : '';

        itemUrls.push(`
  <url>
    <loc>${BASE_URL}/${lang}/city/${city.slug}/${place.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageTag}
  </url>`);
      });
    });
  });

  // 3. Write Files
  const publicDir = path.join(__dirname, '..', 'public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  // Write sitemap-main.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), `${header}${mainUrls.join('')}\n</urlset>`);
  console.log(`✅ sitemap-main.xml created (${mainUrls.length} URLs)`);

  // Write sitemap-items.xml
  fs.writeFileSync(path.join(publicDir, 'sitemap-items.xml'), `${header}${itemUrls.join('')}\n</urlset>`);
  console.log(`✅ sitemap-items.xml created (${itemUrls.length} URLs)`);

  // Write sitemap.xml (The Index)
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
  console.log(`🚀 sitemap.xml (Index) created linking both maps.\n`);
}

generateSitemap();