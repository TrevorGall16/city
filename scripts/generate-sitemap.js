/**
 * Sitemap Generation Script
 * Reads all city JSON files and generates sitemap.xml
 * Run via: npm run generate:sitemap
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://citysheet.com'

async function generateSitemap() {
  console.log('🗺️  Generating sitemap...')

  try {
    const citiesDir = path.join(process.cwd(), 'src/data/cities')

    // Check if directory exists
    if (!fs.existsSync(citiesDir)) {
      console.error('❌ Cities directory not found:', citiesDir)
      process.exit(1)
    }

    const files = fs.readdirSync(citiesDir).filter(f => f.endsWith('.json'))

    if (files.length === 0) {
      console.warn('⚠️  No city files found. Creating minimal sitemap.')
    }

    const urls = []

    // Add homepage
    urls.push({
      loc: '',
      changefreq: 'weekly',
      priority: '1.0',
    })

    // Process each city file
    for (const file of files) {
      const citySlug = file.replace('.json', '')
      const content = fs.readFileSync(path.join(citiesDir, file), 'utf-8')

      let city
      try {
        city = JSON.parse(content)
      } catch (error) {
        console.error(`❌ Invalid JSON in ${file}:`, error.message)
        process.exit(1)
      }

      // Add city page
      urls.push({
        loc: `city/${citySlug}`,
        changefreq: 'weekly',
        priority: '0.9',
      })

      // Add all place pages
      const allPlaces = [...(city.must_eat || []), ...(city.must_see || [])]
      allPlaces.forEach(place => {
        urls.push({
          loc: `city/${citySlug}/${place.slug}`,
          changefreq: 'weekly',
          priority: '0.8',
        })
      })
    }

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${SITE_URL}/${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    // Write to public directory
    const outputPath = path.join(process.cwd(), 'public/sitemap.xml')
    fs.writeFileSync(outputPath, sitemap)

    console.log(`✅ Sitemap generated with ${urls.length} URLs`)
    console.log(`📍 Output: ${outputPath}`)

    // Log summary
    const cityCount = files.length
    const placeCount = urls.length - cityCount - 1 // subtract homepage and city pages
    console.log(`   - 1 homepage`)
    console.log(`   - ${cityCount} city pages`)
    console.log(`   - ${placeCount} place pages`)

  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

generateSitemap()
