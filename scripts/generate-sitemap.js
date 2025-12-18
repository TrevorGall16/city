/**
 * ✅ MASTER AI SITEMAP GENERATOR - CLEAN URL VERSION
 * Generates sitemap.xml for: Homepage, City Hubs, Place Pages, Logistics Topics
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
    const today = new Date().toISOString().split('T')[0]

    // 1. Add homepage
    urls.push({
      loc: '',
      changefreq: 'weekly',
      priority: '1.0',
      lastmod: today,
    })

    // 2. Process each city file
    let skippedFiles = []
    
    for (const file of files) {
      const citySlug = file.replace('.json', '')
      const content = fs.readFileSync(path.join(citiesDir, file), 'utf-8')

      let city
      try {
        city = JSON.parse(content)
      } catch (error) {
        console.error(`❌ Invalid JSON in ${file}:`, error.message)
        skippedFiles.push(file)
        continue
      }

      // City Hub Page (e.g., /paris)
      urls.push({
        loc: citySlug,
        changefreq: 'weekly',
        priority: '0.9',
        lastmod: today,
      })

      // Place Pages (e.g., /paris/eiffel-tower)
      const allPlaces = [...(city.must_eat || []), ...(city.must_see || [])]
      allPlaces.forEach(place => {
        urls.push({
          loc: `${citySlug}/${place.slug}`,
          changefreq: 'weekly',
          priority: '0.8',
          lastmod: today,
        })
      })

      // Logistics/Info Topic Pages (e.g., /paris/getting-sim-card)
      if (city.logistics && Array.isArray(city.logistics)) {
        city.logistics.forEach(topic => {
          urls.push({
            loc: `${citySlug}/${topic.slug}`,
            changefreq: 'monthly',
            priority: '0.7',
            lastmod: today,
          })
        })
      }
    }

    // 3. Generate XML with proper URL formatting
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc ? `${SITE_URL}/${url.loc}` : SITE_URL}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

    const outputPath = path.join(process.cwd(), 'public/sitemap.xml')
    fs.writeFileSync(outputPath, sitemap)

    console.log(`✅ Sitemap generated with ${urls.length} URLs`)
    console.log(`📁 Output: ${outputPath}`)
    
    if (skippedFiles.length > 0) {
      console.warn(`⚠️  Skipped ${skippedFiles.length} invalid files:`, skippedFiles.join(', '))
    }

  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

generateSitemap()