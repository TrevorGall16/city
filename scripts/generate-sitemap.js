/**
 * ✅ MASTER AI SITEMAP GENERATOR - CLEAN URL VERSION
 * Reads all city JSON files and generates sitemap.xml
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://citybasic.com'

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...')

  try {
    const citiesDir = path.join(process.cwd(), 'src/data/cities')

    if (!fs.existsSync(citiesDir)) {
      console.error('❌ Cities directory not found:', citiesDir)
      process.exit(1)
    }

    const files = fs.readdirSync(citiesDir).filter(f => f.endsWith('.json'))
    const urls = []

    // 1. Add homepage
    urls.push({
      loc: '',
      changefreq: 'weekly',
      priority: '1.0',
    })

    // 2. Process each city file
    for (const file of files) {
      const citySlug = file.replace('.json', '')
      const content = fs.readFileSync(path.join(citiesDir, file), 'utf-8')

      let city
      try {
        city = JSON.parse(content)
      } catch (error) {
        console.error(`❌ Invalid JSON in ${file}:`, error.message)
        continue // Skip broken files instead of crashing
      }

      // ✅ FIX 1: Clean City URL (e.g., /paris)
      urls.push({
        loc: `${citySlug}`,
        changefreq: 'weekly',
        priority: '0.9',
      })

      // ✅ FIX 2: Clean Place Pages (e.g., /paris/eiffel-tower)
      const allPlaces = [...(city.must_eat || []), ...(city.must_see || [])]
      allPlaces.forEach(place => {
        urls.push({
          loc: `${citySlug}/${place.slug}`,
          changefreq: 'weekly',
          priority: '0.8',
        })
      })
    } // <--- This bracket was missing in your version!

    // 3. Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${SITE_URL}${url.loc ? `/${url.loc}` : ''}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    const outputPath = path.join(process.cwd(), 'public/sitemap.xml')
    fs.writeFileSync(outputPath, sitemap)

    console.log(`✅ Sitemap generated with ${urls.length} URLs`)
    console.log(`📍 Output: ${outputPath}`)

  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

generateSitemap()