const fs = require('fs');
const path = require('path');

// 1. Define your base domain
const BASE_URL = 'https://citybasic.com';

// 2. Define your languages
const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

// 3. Define your static paths (Home, About, etc.)
const staticPaths = [
  '', // Homepage
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

// 4. Define your main cities (You can add more here later)
const cities = [
  'bangkok', 'berlin', 'istanbul', 'london', 'paris', 'rome', 'tokyo'
];

function generateSitemap() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Generate Home & Static Pages for all languages
  staticPaths.forEach(route => {
    locales.forEach(lang => {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });
  });

  // Generate City Pages for all languages
  cities.forEach(city => {
    locales.forEach(lang => {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}/city/${city}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
    });
  });

  xml += `
</urlset>`;

  // Write the file to the PUBLIC folder
  const publicDir = path.join(__dirname, '..', 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  
  console.log('✅ sitemap.xml generated successfully in public folder!');
}

generateSitemap();