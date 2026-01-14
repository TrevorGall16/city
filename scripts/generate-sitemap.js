const fs = require('fs');
const path = require('path');

// 1. Define your Production Domain (No trailing slash)
const DOMAIN = 'https://citybasic.com';

// 2. Define ALL 9 Supported Languages
const LANGUAGES = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'ar', 'zh'];

// 3. Define Paths
const CITIES_DIR = path.join(__dirname, '../src/data/cities');
const PUBLIC_DIR = path.join(__dirname, '../public');

async function generateSitemap() {
  let urls = [];

  // A. Add Homepages (e.g., /en, /fr, /ja)
  console.log('🔍 Scanning Languages...');
  LANGUAGES.forEach(lang => {
    urls.push(`${DOMAIN}/${lang}`);
  });

  // B. Add City & Place Pages
  console.log('🔍 Scanning Cities...');
  const files = fs.readdirSync(CITIES_DIR);

  files.forEach(file => {
    if (file.endsWith('.json') && !file.includes('-')) { // Only process root files (paris.json), not translations
      const content = JSON.parse(fs.readFileSync(path.join(CITIES_DIR, file), 'utf8'));
      const citySlug = content.slug;

      // Loop through ALL languages for this city
      LANGUAGES.forEach(lang => {
        // 1. Add City URL (e.g., /fr/city/paris)
        urls.push(`${DOMAIN}/${lang}/city/${citySlug}`);

        // 2. Add "Must See" Items
        if (content.must_see) {
          content.must_see.forEach(category => {
            category.items.forEach(place => {
              urls.push(`${DOMAIN}/${lang}/city/${citySlug}/${place.slug}`);
            });
          });
        }

        // 3. Add "Must Eat" Items
        if (content.must_eat) {
          content.must_eat.forEach(place => {
            urls.push(`${DOMAIN}/${lang}/city/${citySlug}/${place.slug}`);
          });
        }
      });
    }
  });

  // C. Build XML
  console.log(`✅ Generated ${urls.length} URLs across ${LANGUAGES.length} languages.`);
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.split('/').length > 4 ? '0.8' : '1.0'}</priority>
  </url>`).join('\n')}
</urlset>`;

  // D. Write to Public Folder
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  console.log('🚀 Sitemap written to public/sitemap.xml');
}

generateSitemap();