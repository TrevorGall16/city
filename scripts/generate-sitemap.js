const fs = require('fs');
const path = require('path');

// ============================================================================
// 🚀 DYNAMIC SITEMAP GENERATOR
// Automatically scans src/data/cities for all cities and their places
// ============================================================================

const BASE_URL = 'https://citybasic.com';
const locales = ['en', 'fr', 'es', 'it', 'ja', 'hi', 'de', 'zh', 'ar'];

// Static pages (Home, About, etc.)
const staticPaths = [
  '', // Homepage
  '/about',
  '/contact',
  '/privacy',
  '/terms',
  '/how-to-use',
  '/corrections'
];

/**
 * Scan the cities directory and extract all city slugs
 * Filters out localized versions (e.g., paris-fr.json)
 */
function getAllCities() {
  const citiesDir = path.join(__dirname, '..', 'src', 'data', 'cities');

  try {
    const files = fs.readdirSync(citiesDir);

    // Get all English city files (base files without language suffix)
    const cities = files
      .filter(file => file.endsWith('.json') && !/-\w{2}\.json$/.test(file))
      .map(file => file.replace('.json', ''));

    console.log(`📍 Found ${cities.length} cities: ${cities.join(', ')}`);
    return cities;
  } catch (error) {
    console.error('❌ Error reading cities directory:', error);
    return [];
  }
}

/**
 * Get all places for a specific city by reading its JSON file
 */
function getCityPlaces(citySlug) {
  const cityFilePath = path.join(__dirname, '..', 'src', 'data', 'cities', `${citySlug}.json`);

  try {
    const cityData = JSON.parse(fs.readFileSync(cityFilePath, 'utf-8'));
    const places = [];

    // Extract places from must_see
    if (cityData.must_see && Array.isArray(cityData.must_see)) {
      cityData.must_see.forEach(section => {
        if (section.items && Array.isArray(section.items)) {
          section.items.forEach(place => {
            if (place.slug) {
              places.push(place.slug);
            }
          });
        }
      });
    }

    // Extract places from must_eat
    if (cityData.must_eat && Array.isArray(cityData.must_eat)) {
      cityData.must_eat.forEach(place => {
        if (place.slug) {
          places.push(place.slug);
        }
      });
    }

    return places;
  } catch (error) {
    console.warn(`⚠️  Could not read places for ${citySlug}:`, error.message);
    return [];
  }
}

/**
 * Generate complete sitemap with all pages
 */
function generateSitemap() {
  console.log('🗺️  Starting sitemap generation...\n');

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  let urlCount = 0;

  // ========================================
  // 1. Static Pages (Home, About, etc.)
  // ========================================
  console.log('📄 Generating static pages...');
  staticPaths.forEach(route => {
    locales.forEach(lang => {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`;
      urlCount++;
    });
  });
  console.log(`   ✅ Added ${staticPaths.length * locales.length} static URLs\n`);

  // ========================================
  // 2. City Pages (Dynamically Scanned)
  // ========================================
  console.log('🌆 Generating city pages...');
  const cities = getAllCities();

  cities.forEach(citySlug => {
    locales.forEach(lang => {
      xml += `
  <url>
    <loc>${BASE_URL}/${lang}/city/${citySlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
      urlCount++;
    });
  });
  console.log(`   ✅ Added ${cities.length * locales.length} city URLs\n`);

  // ========================================
  // 3. Place Pages (Within Each City)
  // ========================================
  console.log('🏛️  Generating place pages...');
  let totalPlaces = 0;

  cities.forEach(citySlug => {
    const places = getCityPlaces(citySlug);

    if (places.length > 0) {
      console.log(`   📍 ${citySlug}: ${places.length} places`);

      places.forEach(placeSlug => {
        locales.forEach(lang => {
          xml += `
  <url>
    <loc>${BASE_URL}/${lang}/city/${citySlug}/${placeSlug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
          urlCount++;
          totalPlaces++;
        });
      });
    }
  });
  console.log(`   ✅ Added ${totalPlaces * locales.length} place URLs\n`);

  xml += `
</urlset>`;

  // ========================================
  // 4. Write to File
  // ========================================
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');

  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(sitemapPath, xml);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📊 Total URLs: ${urlCount}`);
  console.log(`📁 Location: ${sitemapPath}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// Run the generator
generateSitemap();